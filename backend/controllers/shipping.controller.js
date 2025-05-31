import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv'; // Import dotenv nếu chưa có
import { getDistance } from 'geolib';

dotenv.config(); // Load biến môi trường từ file .env

const prisma = new PrismaClient();

// Hàm gọi OpenCage API để lấy tọa độ
export const getCoordinatesFromAddress = async (address) => {
    try {
        // Lấy API key từ biến môi trường
        const API_KEY = process.env.OPENCAGE_API_KEY;

        if (!API_KEY) {
            throw new Error('OpenCage API key không được cấu hình trong biến môi trường (OPENCAGE_API_KEY)');
        }

        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${API_KEY}`;

        const response = await axios.get(url);

        if (response.data.results && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return {
                latitude: lat,
                longitude: lng
            };
        }

        throw new Error('Không tìm thấy tọa độ cho địa chỉ này');
    } catch (error) {
        console.error('Lỗi khi gọi OpenCage API:', error);
        throw error;
    }
};

const calculateBillableWeight = (productInfo) => {
    // 1. Lấy thông số từ productInfo (có validate)
    const actualWeight = Math.max(0, Number(productInfo.weight) || 0); // Đảm bảo không âm
    const length = Math.max(0, Number(productInfo.length) || 0);
    const width = Math.max(0, Number(productInfo.width) || 0);
    const height = Math.max(0, Number(productInfo.height) || 0);

    // 2. Cấu hình có thể tùy chỉnh (nên lấy từ database/config)
    const VOLUMETRIC_FACTOR = 3000; // Hệ số quy đổi thể tích (phổ biến: 3000, 4000, 5000)
    const MINIMUM_WEIGHT = 0.5; // Trọng lượng tối thiểu (0.5kg phổ biến hơn 0.25kg)
    const ROUND_TO_NEAREST = 0.5; // Làm tròn đến 0.5kg

    // 3. Tính trọng lượng thể tích (volumetric weight)
    let volumetricWeight = 0;
    if (length > 0 && width > 0 && height > 0) {
        volumetricWeight = (length * width * height) / VOLUMETRIC_FACTOR;
    }

    // 4. Lấy giá trị lớn hơn giữa trọng lượng thực và thể tích
    let billableWeight = Math.max(actualWeight, volumetricWeight);

    // 5. Áp dụng trọng lượng tối thiểu
    billableWeight = Math.max(billableWeight, MINIMUM_WEIGHT);

    // 6. Làm tròn theo quy định (vd: 0.5kg)
    billableWeight = Math.ceil(billableWeight * (1 / ROUND_TO_NEAREST)) * ROUND_TO_NEAREST;

    return billableWeight;
};

export const calculateShippingCost = async (req, res) => {
    try {
        console.log('Request body:', req.body);  // <-- In ra payload nhận được từ frontend

        // 1. Get User ID from authenticated user
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
        }
        // 2. Fetch sender address from database using userId
        // Vẫn cần lấy đầy đủ thông tin địa chỉ để tạo chuỗi cho geocoding
        const senderAddress = await prisma.address.findFirst({
            where: {
                userId: userId,
                is_deleted: false
            },
            select: {
                addressDetail: true,
                province: true,
                district: true,
                ward: true,
                postalCode: true // Thêm postalCode nếu có thể giúp geocoding chính xác hơn
            }
        });

        if (!senderAddress) {
            return res.status(404).json({
                message: 'Không tìm thấy địa chỉ người gửi. Vui lòng thêm địa chỉ trước khi tính phí vận chuyển.'
            });
        }

        // 3. Get receiver address and product info from request body
        const { receiverAddress, productInfo: rawProductInfo } = req.body;

        // Validate receiver address (province, district, ward là bắt buộc)
        if (!receiverAddress || !receiverAddress.province || !receiverAddress.district || !receiverAddress.ward) {
            return res.status(400).json({
                message: 'Thiếu thông tin địa chỉ người nhận. Vui lòng cung cấp đầy đủ tỉnh/thành, quận/huyện, phường/xã.'
            });
        }
        // addressDetail của receiverAddress có thể tùy chọn nhưng nên có để geocoding chính xác
        // if (!receiverAddress.addressDetail) { ... }


        // Sử dụng thông tin sản phẩm nếu có, nếu không thì dùng object rỗng
        const productInfo = rawProductInfo || {};

        // Lấy số lượng sản phẩm (mặc định 1 nếu thiếu hoặc <= 0)
        const quantity = (productInfo.quantity && productInfo.quantity > 0) ? productInfo.quantity : 1;


        // 4. Tạo chuỗi địa chỉ đầy đủ cho geocoding
        // Sử dụng addressDetail và postalCode nếu có để tăng độ chính xác
        const senderAddressParts = [senderAddress.addressDetail, senderAddress.ward, senderAddress.district, senderAddress.province, senderAddress.postalCode, 'Vietnam'].filter(part => part);
        const senderAddressString = senderAddressParts.join(', ');

        const receiverAddressParts = [receiverAddress.addressDetail, receiverAddress.ward, receiverAddress.district, receiverAddress.province, 'Vietnam'].filter(part => part);
        const receiverAddressString = receiverAddressParts.join(', ');

        // Log địa chỉ dùng để geocode (hữu ích cho debug)
        console.log('Sender address for geocoding:', senderAddressString);
        console.log('Receiver address for geocoding:', receiverAddressString);


        // 5. Gọi API lấy tọa độ
        let senderCoords, receiverCoords;
        try {
            senderCoords = await getCoordinatesFromAddress(senderAddressString);
            receiverCoords = await getCoordinatesFromAddress(receiverAddressString);
        } catch (apiError) {
            console.error('Lỗi geocoding:', apiError.message);
            return res.status(500).json({ message: `Không thể lấy tọa độ: ${apiError.message}` });
        }


        // 6. Calculate distance using geolib
        let distanceInMeters;
        try {
            distanceInMeters = getDistance(senderCoords, receiverCoords);
        } catch (geoError) {
            console.error('Lỗi tính khoảng cách:', geoError.message);
            return res.status(500).json({ message: 'Lỗi khi tính khoảng cách giữa hai địa điểm.' });
        }
        const distanceInKm = distanceInMeters / 1000;
        console.log(`Distance: ${distanceInKm.toFixed(2)} km`);


        // 7. Calculate Billable Weight (giữ nguyên như cũ)
        const billableWeight = calculateBillableWeight(productInfo);
        console.log(`Billable Weight: ${billableWeight.toFixed(2)} kg`);

        // 8. Define pricing rules (có thể lưu trong database hoặc config)
        const pricingRules = {
            baseCost: 15000, // Phí cơ bản
            distanceRate: 2000, // VND/km cho khoảng cách
            weightRate: 5000, // VND/kg
            additionalWeightRate: 3000, // VND/kg cho mỗi kg vượt quá
            weightThreshold: 1, // Ngưỡng trọng lượng (kg)
            distanceThreshold: 50, // Ngưỡng khoảng cách (km)
            additionalDistanceRate: 1500, // VND/km cho khoảng cách vượt ngưỡng
            quantityRate: 0.1, // % tăng thêm cho mỗi sản phẩm thêm
            maxDistanceCost: 500000, // Giới hạn chi phí khoảng cách tối đa
            minCost: 20000, // Chi phí tối thiểu
        };

        // 9. Calculate distance cost (có giới hạn tối đa)
        let distanceCost = Math.min(
            distanceInKm <= pricingRules.distanceThreshold
                ? distanceInKm * pricingRules.distanceRate
                : pricingRules.distanceThreshold * pricingRules.distanceRate +
                (distanceInKm - pricingRules.distanceThreshold) * pricingRules.additionalDistanceRate,
            pricingRules.maxDistanceCost
        );

        // 10. Calculate weight cost (tăng tỷ lệ khi vượt ngưỡng)
        let weightCost = billableWeight <= pricingRules.weightThreshold
            ? billableWeight * pricingRules.weightRate
            : pricingRules.weightThreshold * pricingRules.weightRate +
            (billableWeight - pricingRules.weightThreshold) * pricingRules.additionalWeightRate;

        // 11. Apply quantity factor (tăng % theo số lượng)
        const quantityFactor = 1 + (Math.max(1, quantity) - 1) * pricingRules.quantityRate;

        // 12. Calculate total cost
        let totalCost = pricingRules.baseCost + distanceCost + weightCost;
        totalCost *= quantityFactor;

        // Đảm bảo chi phí không thấp hơn mức tối thiểu
        totalCost = Math.max(totalCost, pricingRules.minCost);

        // 13. Apply additional fees (COD, bảo hiểm, etc.)
        if (req.body.codAmount) {
            const codFee = Math.max(5000, req.body.codAmount * 0.01); // 1% COD fee, tối thiểu 5k
            totalCost += codFee;
        }

        if (req.body.insuranceRequired) {
            totalCost += 10000; // Phí bảo hiểm 10k
        }

        // 14. Round to nearest 500 VND để đẹp số
        totalCost = Math.round(totalCost / 500) * 500;

        // 15. Send response
        const response = {
            message: 'Shipping cost calculated successfully',
            totalCost: totalCost,
            breakdown: {
                baseCost: pricingRules.baseCost,
                distanceCost: parseFloat(distanceCost.toFixed(2)),
                weightCost: parseFloat(weightCost.toFixed(2)),
                quantityFactor: parseFloat(quantityFactor.toFixed(2)),
                additionalFees: {
                    codFee: req.body.codAmount ? Math.max(5000, req.body.codAmount * 0.01) : 0,
                    insuranceFee: req.body.insuranceRequired ? 10000 : 0
                }
            },
            details: {
                distanceKm: parseFloat(distanceInKm.toFixed(2)),
                billableWeightKg: parseFloat(billableWeight.toFixed(2)),
                quantity: quantity
            },
            receiverCoords: {
                latitude: receiverCoords.latitude,
                longitude: receiverCoords.longitude
            }
        };

        console.log('Shipping cost response:', JSON.stringify(response, null, 2));
        res.status(200).json(response);

    } catch (error) {
        console.error('Error calculating shipping cost:', error);
        // Trả về lỗi chung cho client để tránh lộ thông tin nhạy cảm
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình tính phí vận chuyển.',
            error: error.message, // Có thể chỉ trả về thông báo lỗi chung thay vì error.message chi tiết trong production
        });
    }
};

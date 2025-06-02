const shippingTestCases = {
    calculate: {
        // 1. Success Case - Basic Calculation
        basicSuccess: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                }
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        },

        // 2. Missing Required Address Fields
        missingAddressFields: {
            request: {
                receiverAddress: {
                    province: "Ha Noi"
                    // Missing district and ward
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                }
            },
            expected: {
                status: 400,
                message: "Thiếu thông tin địa chỉ người nhận. Vui lòng cung cấp đầy đủ tỉnh/thành, quận/huyện, phường/xã."
            }
        },

        // 3. Sender Address Not Found
        senderAddressNotFound: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                }
            },
            expected: {
                status: 404,
                message: "Không tìm thấy địa chỉ người gửi. Vui lòng thêm địa chỉ trước khi tính phí vận chuyển."
            }
        },

        // 4. With COD Amount
        withCOD: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                },
                codAmount: 1000000 // 1 million VND
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        },

        // 5. With Insurance
        withInsurance: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                },
                insuranceRequired: true
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        },

        // 6. Heavy Package
        heavyPackage: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 5, // Over weight threshold
                    quantity: 1
                }
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        },

        // 7. Multiple Items
        multipleItems: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 1,
                    quantity: 3 // Multiple items
                }
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        },

        // 8. Long Distance
        longDistance: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ho Chi Minh", // Far from sender
                    district: "District 1",
                    ward: "Ben Nghe"
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                }
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        },

        // 9. Invalid Address (Geocoding Error)
        invalidAddress: {
            request: {
                receiverAddress: {
                    addressDetail: "Invalid Address",
                    province: "Invalid Province",
                    district: "Invalid District",
                    ward: "Invalid Ward"
                },
                productInfo: {
                    weight: 1,
                    quantity: 1
                }
            },
            expected: {
                status: 500,
                message: "Không thể lấy tọa độ: Không tìm thấy tọa độ cho địa chỉ này"
            }
        },

        // 10. Volumetric Weight Calculation
        volumetricWeight: {
            request: {
                receiverAddress: {
                    addressDetail: "123 Test Street",
                    province: "Ha Noi",
                    district: "Cau Giay",
                    ward: "Dich Vong"
                },
                productInfo: {
                    weight: 1,
                    length: 50,
                    width: 30,
                    height: 20,
                    quantity: 1
                }
            },
            expected: {
                status: 200,
                message: "Shipping cost calculated successfully"
            }
        }
    }
};

export default shippingTestCases; 
// BannerSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { IKImage } from "imagekitio-react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

const bannerItems = [
    "banner/1.webp",
    "banner/2.webp",
    "banner/3.webp",
    "banner/4.webp",
    "banner/5.webp",
    "banner/6.webp",
];

const BannerSlider = () => {
    return (
        <div className="banner-slider">
            <div className="banner-slider-inner">
                <Swiper
                    loop={true}
                    effect="fade"
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, EffectFade]}
                >
                    {bannerItems.map((src, index) => (
                        <SwiperSlide key={index} className="banner-slide">
                            <IKImage
                                path={src}
                                alt={`Banner ${index + 1}`}
                                urlEndpoint={import.meta.env.VITE_URL_IK_ENDPOINT}
                                className="banner-slide-img"
                                transformation={[
                                    { height: 818, width: 1904, crop: "maintain_ratio" },
                                ]}
                                lqip={{ active: true, quality: 20 }}
                                loading="lazy"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default BannerSlider;

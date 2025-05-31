import { Link } from "react-router-dom";
import BannerSlider from "@/modules/intro/components/BannerSlider/BannerSlider";
import QuickLinksBar from "@/modules/intro/components/QuickLinksBar/QuickLinksBar";

const Homepage = () => {
    return (
        <div>
            <BannerSlider />
            <QuickLinksBar />
            {/* Thêm các components khác nếu cần */}
        </div>
    );
};

export default Homepage;

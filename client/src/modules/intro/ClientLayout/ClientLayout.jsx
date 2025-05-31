import TopBar from '../components/topBar/topBar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/footer/footer';

const ClientLayout = () => {
    return (
        <div>
            <div className="selector">
                <TopBar />
            </div>
            <div className="content">
                <Outlet />
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
};

export default ClientLayout;

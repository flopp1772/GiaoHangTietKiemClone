// assets
// import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import { ChatBubbleOutline, RateReviewOutlined, FeedbackOutlined, LiveHelpOutlined } from '@mui/icons-material';

// icons
const icons = {
  ChatBubbleOutline,
  RateReviewOutlined,
  FeedbackOutlined,
  LiveHelpOutlined
};

// ==============================|| MENU ITEMS - REVIEWS & FEEDBACK ||============================== //

const customerReviewsfeedback = {
  id: 'reviews-feedback-group',
  title: 'Reviews & Feedback',
  type: 'group',
  children: [
    {
      id: 'rate-shipper',
      title: 'Rate the Shipper',
      type: 'item',
      url: '/reviews/shipper',
      icon: icons.RateReviewOutlined
    },
    {
      id: 'service-feedback',
      title: 'Service Feedback',
      type: 'item',
      url: '/feedback/service',
      icon: icons.FeedbackOutlined
    },
    {
      id: 'request-support',
      title: 'Request Support',
      type: 'item',
      url: '/support/request',
      icon: icons.LiveHelpOutlined,
      // external: true, // Assuming these links are within the app now
      target: false
    }
  ]
};

export default customerReviewsfeedback;

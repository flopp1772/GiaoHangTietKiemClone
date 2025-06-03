# Đóng góp vào GHTK Clone Backend

Đóng góp cho GHTK Clone bao gồm code, tài liệu, trả lời câu hỏi người dùng, cải thiện kiểm thử, vận hành hạ tầng và lan tỏa giá trị đến cộng đồng người dùng.

Chúng tôi hoan nghênh mọi đóng góp từ bất kỳ ai sẵn sàng hợp tác thiện chí với các thành viên khác. Không có đóng góp nào là quá nhỏ – mọi đóng góp đều có giá trị!

GHTK Clone áp dụng mô hình quản trị mở. Những cá nhân có đóng góp nổi bật sẽ được mời trở thành Collaborator với quyền commit vào dự án. Xem thêm chi tiết tại [GOVERNANCE.md](./GOVERNANCE.md).

## Mục lục

- [Quy tắc ứng xử](#quy-tắc-ứng-xử)
- [Báo lỗi & Hỏi đáp](#báo-lỗi--hỏi-đáp)
- [Pull Request](#pull-request)
- [Chứng nhận của người phát triển 1.1](#chứng-nhận-của-người-phát-triển-11)
- [Quy tắc Đặt tên & Coding Style cho GHTK Clone Backend](#quy-tắc-đặt-tên--coding-style-cho-ghtk-clone-backend)

---

## Quy tắc ứng xử

Tất cả thành viên phải tuân thủ [Quy tắc ứng xử](./CODE_OF_CONDUCT.md) để xây dựng cộng đồng thân thiện và tôn trọng lẫn nhau.

---

## Báo lỗi & Hỏi đáp

- **Hỏi đáp chung:**  
  Tạo issue với label `question` hoặc tham gia Discussions (nếu có).
- **Báo lỗi:**  
  Tạo issue mới, mô tả rõ ràng lỗi gặp phải, kèm theo log/error, môi trường, các bước tái hiện và mong đợi.
- **Đề xuất tính năng:**  
  Tạo issue với label `enhancement` và mô tả chi tiết ý tưởng của bạn.
- **Hỗ trợ xác nhận lỗi:**  
  Tham gia xác nhận lỗi, gợi ý label hoặc bổ sung thông tin cho các issue.

---

## Pull Request

Pull Request (PR) là cách chính để đề xuất thay đổi code, tài liệu, dependencies hoặc công cụ trong repository này.

- **Dependencies:**  
  Chỉ cập nhật dependencies khi thực sự cần thiết và giải thích lý do trong PR.
- **Thiết lập môi trường phát triển:**  
  Xem hướng dẫn trong [README.md](./README.md).
- **Thực hiện thay đổi:**  
  Fork repo, tạo branch mới, thực hiện thay đổi và mở PR với mô tả rõ ràng.
- **Review PR:**  
  PR sẽ được review bởi Collaborator. Vui lòng phản hồi góp ý và cập nhật khi cần.
- **Lưu ý:**  
  Đảm bảo code tuân thủ style dự án và vượt qua tất cả kiểm thử trước khi gửi PR.

---

## Chứng nhận của người phát triển 1.1

```text
Bằng việc đóng góp vào dự án này, tôi xác nhận rằng:

 (a) Đóng góp này do tôi tạo ra (toàn bộ hoặc một phần) và tôi có quyền gửi nó theo giấy phép mã nguồn mở được chỉ định; hoặc

 (b) Đóng góp này dựa trên công việc trước đó mà, theo hiểu biết tốt nhất của tôi, được cấp phép mã nguồn mở phù hợp và tôi có quyền gửi đóng góp này (toàn bộ hoặc một phần) với các sửa đổi, theo cùng giấy phép mã nguồn mở (trừ khi được phép gửi theo giấy phép khác), như đã chỉ định; hoặc

 (c) Đóng góp này được cung cấp trực tiếp cho tôi bởi người khác đã xác nhận (a), (b) hoặc (c) và tôi không chỉnh sửa gì thêm.

 (d) Tôi hiểu và đồng ý rằng dự án này và đóng góp của tôi là công khai, mọi thông tin cá nhân tôi gửi kèm sẽ được lưu trữ vô thời hạn và có thể được phân phối lại theo giấy phép của dự án.
```

---

Cảm ơn bạn đã đóng góp cho GHTK Clone! Nếu có bất kỳ câu hỏi nào, hãy mở issue hoặc liên hệ với nhóm phát triển.

---

# Quy tắc Đặt tên & Coding Style cho GHTK Clone Backend

Tài liệu này hướng dẫn các quy tắc đặt tên và coding style chuẩn cho dự án GHTK Clone Backend. Mục tiêu là đảm bảo codebase nhất quán, dễ đọc, dễ bảo trì và thân thiện với cộng đồng phát triển.

## Mục lục

- [Quy tắc đặt tên biến](#quy-tắc-đặt-tên-biến)
- [Quy tắc đặt tên hàm](#quy-tắc-đặt-tên-hàm)
- [Quy tắc đặt tên file & thư mục](#quy-tắc-đặt-tên-file--thư-mục)
- [Coding Style tổng quát](#coding-style-tổng-quát)
- [Ví dụ thực tế](#ví-dụ-thực-tế)

---

## Quy tắc đặt tên biến

- Sử dụng **camelCase** cho biến và thuộc tính (ví dụ: `userName`, `orderList`, `shippingFee`).
- Tên biến phải rõ nghĩa, ngắn gọn, tránh viết tắt khó hiểu.
- Biến boolean nên bắt đầu bằng `is`, `has`, `can`, `should` (ví dụ: `isActive`, `hasPermission`, `canEdit`).
- Biến hằng số (constant) dùng **UPPER_SNAKE_CASE** (ví dụ: `MAX_PAGE_SIZE`).

## Quy tắc đặt tên hàm

- Sử dụng **camelCase** cho tên hàm (ví dụ: `getUserById`, `calculateShippingCost`).
- Tên hàm là động từ hoặc cụm động từ, mô tả rõ chức năng (ví dụ: `createOrder`, `updateUser`, `deleteAccount`).
- Hàm trả về boolean nên đặt tên dạng câu hỏi (ví dụ: `isValidEmail`, `hasRole`).

## Quy tắc đặt tên file & thư mục

- Tên file dùng **kebab-case** (chữ thường, cách nhau bằng dấu gạch ngang), ví dụ: `user.controller.js`, `order.route.js`.
- Tên thư mục dùng **kebab-case** hoặc **lowercase** (ví dụ: `controllers/`, `routes/`, `middlewares/`).
- File chứa class hoặc model có thể dùng PascalCase nếu cần (ví dụ: `User.js`).

## Coding Style tổng quát

- **Indent:** 2 spaces hoặc 4 spaces (toàn dự án nên thống nhất, khuyến nghị 2 spaces).
- **Dấu ngoặc nhọn:** Mở cùng dòng với khai báo hàm/if/for (K&R style).
- **Dấu chấm phẩy:** Bắt buộc dùng ở cuối mỗi câu lệnh.
- **Dấu nháy:** Ưu tiên dùng nháy đơn `'` cho string, chỉ dùng nháy kép `"` khi cần escape.
- **Khai báo biến:** Dùng `const` mặc định, chỉ dùng `let` khi cần gán lại giá trị.
- **Comment:**
  - Dùng tiếng Việt hoặc tiếng Anh rõ ràng, ngắn gọn.
  - Comment block cho hàm phức tạp, giải thích logic hoặc các trường hợp đặc biệt.
- **Import:**
  - Import module bên ngoài lên đầu file, sau đó đến import nội bộ.
  - Sắp xếp import theo nhóm.

## Ví dụ thực tế

```js
// Đặt tên biến
const userName = 'John';
const isActive = true;
const MAX_PAGE_SIZE = 100;

// Đặt tên hàm
function getUserById(id) { /* ... */ }
function calculateShippingCost(order) { /* ... */ }
function isValidEmail(email) { /* ... */ }

// Đặt tên file/thư mục
// controllers/user.controller.js
// routes/order.route.js
// middlewares/verify-token.js

// Coding style
if (isActive) {
  console.log('User is active');
}

const orderList = orders.filter(order => order.isActive);
```

---

Áp dụng đúng các quy tắc này sẽ giúp dự án phát triển bền vững, dễ mở rộng và dễ tiếp cận cho cộng đồng!
--Run project
ng serve -o --port 8320

--build production
ng build --prod


Theme: Ng-alain https://ng-alain.com/en
Compnent: Ant Design of Angular - https://ng.ant.design/docs/introduce/en

![Architecture](\src\assets\tmp\img\theme\architecture.png "Architecture @theme")

Ant design - Angular 10
- Sử dụng tslint để gợi ý và bổ sung convention cho code
- Sử dụng extenstion prettier để format định dạng code
- 


# Folder Structure
```
📦src
 ┣ 📂app
 ┃ ┣ 📂core
 ┃ ┃ ┣ 📂i18n                       -- Cấu hình đa ngôn ngữ
 ┃ ┃ ┣ 📂net                        -- Middleware cho api service
 ┃ ┃ ┣ 📂startup                    -- File đầu tiên chạy khi mở trang web
 ┃ ┣ 📂layout                       -- Thư mục chứa cấu hình layout cho theme
 ┃ ┃ ┣ 📂passport                   -- Layout đăng nhập
 ┃ ┃ ┣ 📂pro                        -- Layout giao diện admin
 ┃ ┃ ┃ ┣ 📂components               -- Component dùng chung cho layout
 ┃ ┃ ┃ ┣ 📂setting-drawer
 ┃ ┃ ┃ ┣ 📂styles                   -- Style cho layout
 ┃ ┃ ┃ ┣ 📂test                     -- Test
 ┃ ┃ ┃ ┣ 📂theme-btn
 ┃ ┣ 📂models                       -- Model hệ thống
 ┃ ┃ ┣ 📂core                       -- Model dùng chung
 ┃ ┃ ┣ 📂...                        -- Model theo từng module
 ┃ ┣ 📂routes
 ┃ ┃ ┣ 📂callback
 ┃ ┃ ┣ 📂dashboard
 ┃ ┃ ┣ 📂demo                       -- Route phục vụ cho demo
 ┃ ┃ ┣ 📂exception                  -- Thư mục cấu hình các trang exception
 ┃ ┃ ┣ 📂passport                   -- Thư mục chứa các trang thuộc module đăng nhập/đăng ký
 ┃ ┃ ┣ 📜routes-routing.module.ts   -- File cấu hình routing
 ┃ ┃ ┗ 📜routes.module.ts           -- File cấu hình module tổng
 ┃ ┣ 📂services                     -- Service hệ thống
 ┃ ┃ ┣ 📂api                        -- Service dành cho api
 ┃ ┃ ┣ 📂core                       -- Service dùng chung cho theme
 ┃ ┣ 📂shared                       -- Module chứa các phần dùng chung
 ┃ ┃ ┣ 📂components                 -- Component dùng chung
 ┃ ┃ ┣ 📂json-schema
 ┃ ┃ ┣ 📂pipes                      -- Pipe dùng chung
 ┃ ┃ ┣ 📂st-widget
 ┃ ┃ ┣ 📂utils                      
 ┃ ┣ 📂utils                        -- Thư mục chứa các tham số dùng chung
 ┃ ┃ ┣ 📜api-router.ts              -- File chứa các url api
 ┃ ┃ ┣ 📜constants.ts               -- Các tham số dùng chung
 ┃ ┃ ┗ 📜utils.ts                   -- Các hàm dùng chung
 ┣ 📂assets                         -- Thư mục chưa các file tĩnh
 ┃ ┣ 📂tmp          
 ┃ ┃ ┣ 📂i18n                       -- File đa ngôn ngữ
 ┃ ┃ ┣ 📂img                        -- File ảnh    
 ┃ ┃ ┣ 📂img-big                    -- File ảnh    
 ┣ 📂environments                   -- Thư mục chứa thông tin cấu hình môi trường
 ┃ ┣ 📜environment.hmr.ts           -- Cấu hình môi trường HRM (Hot Module Replacement)
 ┃ ┣ 📜environment.prod.ts          -- Cấu hình build môi trường production
 ┃ ┗ 📜environment.ts               -- Cấu hình môi trường dev
 ┣ 📂styles                         -- Style theme
```
## Convention
Tham khảo tại link sau: https://angular.io/guide/styleguide

- Các tham số dùng chung cần được khai báo là <code>const</code> trong file <code>@utils/constants.ts</code>
- Tham số dùng chung cần được viết in hoa, các chữ ngăn cách với nhau bởi dấu gạch dưới. VD: <code>ROLE_SYS_ADMIN, QUERY_FILTER_DEFAULT</code>
- Các hàm dùng chung cần được viết trong file <code>@utils/utils.ts</code>
- Các hàm phải bắt đầu bằng chữ thường theo cú pháp <code>camelCase</code>. VD: <code>stringToBoolean, numberWithCommas</code>
- Các hàm mô tả sự kiện nhấn vào button, label, icon... cần được bắt đầu bằng tiền tố: <code>on....</code> VD: <code>onClickButtonAdd, onChangeSelectStatus</code>
- _Các phần còn thiếu sẽ bổ sung theo thời gian_






export const verifyEmailTemplate = (url) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f3f4f6;
          color: #065f46;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          font-size: 24px;
          font-weight: bold;
          color: #065f46; /* Tailwind's green-950 */
        }
        .content {
          font-size: 16px;
          line-height: 1.5;
          text-align: center;
          margin-bottom: 20px;
        }
        .cta-button {
          display: inline-block;
          background-color: #065f46; /* Tailwind's green-950 */
          color: #ffffff !important;
          padding: 12px 30px;
          text-decoration: none !important; /* Remove underline */
          border-radius: 5px;
          font-size: 18px;
          margin-top: 20px;
          cursor: pointer;
        }
        .cta-button:hover {
          background-color: #064e3b; /* Darker green on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Xác Minh Tài Khoản TPizza</div>
        <div class="content">
          <p>Chào mừng bạn đến với TPizza!</p>
          <p>Nhấn vào nút dưới đây để xác minh địa chỉ email của bạn:</p>
          <a href="${url}" class="cta-button">Xác Minh Email</a>
          <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
        </div>
      </div>
    </body>
  </html>
`;

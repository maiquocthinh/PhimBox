const getTemplateWelcome = ({ username }) => `<!DOCTYPE html>
    <html>
        <head>
            <title>Chào mừng gia nhập PhimBox</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333;">
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; background-color: #fff;">
                <div class="header" style="margin-top: 20px; text-align: center; font-size: 32px; color: #1a73e8;">
                    <p>PhimBox</p>
                </div>
                <div class="content" style="margin-top: 20px;">
                    <h2 style="color: #333;">🎉Chào mừng ${username} đã gia nhập PhimBox🎉,</h2>
                    <h3 style="color: #444;">Chúc bạn xem phim vui vẻ ❤.</h3>
                </div>
                <div class="footer" style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
                    <p>Trân trọng,</p>
                    <p style="font-weight: 500; color: #1a73e8;">PhimBox Team</p>
                </div>
            </div>
        </body>
    </html>`;

const getTemplateNewPassword = ({ username, newPassword }) => `<!DOCTYPE html>
    <html>
        <head>
            <title>Thông báo mật khẩu mới</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333;">
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; background-color: #fff;">
                <div class="header" style="margin-top: 20px; text-align: center; font-size: 32px; color: #1a73e8;">
                    <p>PhimBox</p>
                </div>
                <div class="content" style="margin-top: 20px;">
                    <h2 style="color: #333;">Xin chào ${username} 👋,</h2>
                    <p style="color: #444;">Chúng tôi gửi đến bạn thông tin về mật khẩu mới cho tài khoản của bạn:</p>
                    <p style="color: #000;"><strong>Mật khẩu mới 🔑: ${newPassword}</strong></p>
                    <p style="color: #444;">Để đảm bảo tính bảo mật cho tài khoản của bạn, hãy thay đổi mật khẩu ngay sau khi đăng nhập bằng mật khẩu mới.</p>
                    <p style="color: #444;">Chúc bạn xem phim vui vẻ ❤.</p>
                </div>
                <div class="footer" style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
                    <p>Trân trọng,</p>
                    <p style="font-weight: 500; color: #1a73e8;">PhimBox Team</p>
                </div>
            </div>
        </body>
    </html>`;

const getTemplateNewEpUpdate = ({ username, filmName, epName, url }) => `<!DOCTYPE html>
    <html>
        <head>
            <title>Thông báo ${filmName} cập nhật tập mới</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333;">
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; background-color: #fff;">
                <div class="header" style="margin-top: 20px; text-align: center; font-size: 32px; color: #1a73e8;">
                    <p>PhimBox</p>
                </div>
                <div class="content" style="margin-top: 20px;">
                    <h2 style="color: #333;">Xin chào ${username} 👋,</h2>
                    <p style="color: #444;">Bộ phim 🎬<strong>${filmName}</strong> vừa cập nhật tập 🎞<strong>${epName}</strong>.</p>
                    <p style="color: #444;">Hãy truy cập và xem ngay nhá 👉 <a href="${url}">Link</a>.</p>
                    <p style="color: #444;">Chúc bạn xem phim vui vẻ ❤.</p>
                </div>
                <div class="footer" style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
                    <p>Trân trọng,</p>
                    <p style="font-weight: 500; color: #1a73e8;">PhimBox Team</p>
                </div>
            </div>
        </body>
    </html>`;

module.exports = { getTemplateNewPassword, getTemplateWelcome, getTemplateNewEpUpdate };

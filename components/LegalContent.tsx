import React from 'react';

const commonTextStyle = "text-text-secondary leading-relaxed mb-4";
const h3Style = "text-xl font-bold text-text-main mt-6 mb-3";

export const AboutUsContent: React.FC = () => (
  <div className={commonTextStyle}>
    <p>
      Công ty Cổ phần Dịch vụ Quốc tế NTC được thành lập với sứ mệnh mang đến những giải pháp công nghệ tiên tiến nhất cho các nhà sáng tạo nội dung tại Việt Nam. Bằng việc hợp tác chiến lược với các đối tác công nghệ hàng đầu như **AI-Vantage Corp (Silicon Valley, Hoa Kỳ)** và **Global Creative Solutions (Singapore)**, chúng tôi tự hào giới thiệu YT Pro Tools - một nền tảng toàn diện, được tích hợp trí tuệ nhân tạo (AI) mạnh mẽ.
    </p>
    <p>
      Mục tiêu của chúng tôi là phá bỏ mọi rào cản kỹ thuật, giúp các YouTuber tập trung vào điều họ làm tốt nhất: sáng tạo. Chúng tôi cam kết không ngừng đổi mới và đồng hành cùng sự phát triển bền vững của cộng đồng sáng tạo Việt Nam.
    </p>
  </div>
);

export const ContactContent: React.FC = () => (
    <div className={commonTextStyle}>
        <p className="flex items-center space-x-3">
            <strong className="text-text-main">Hotline/Zalo:</strong> 
            <a href="tel:0789284078" className="text-primary hover:underline">0789284078</a>
        </p>
        <p className="flex items-center space-x-3 mt-2">
            <strong className="text-text-main">Email:</strong>
            <a href="mailto:dollarpvt@gmail.com" className="text-primary hover:underline">dollarpvt@gmail.com</a>
        </p>
    </div>
);

export const BlogContent: React.FC = () => (
    <div className="space-y-6">
        <div className="border-b border-secondary pb-4">
            <h3 className="text-xl font-bold text-primary hover:text-red-700 cursor-pointer">5 Sai Lầm SEO YouTube Khiến Kênh Của Bạn "Mất Hút" và Cách Khắc Phục</h3>
            <p className={commonTextStyle}>Khám phá những lỗi phổ biến nhất mà các creator thường mắc phải khi tối ưu hóa video và học cách sửa chữa chúng để tăng vọt thứ hạng tìm kiếm...</p>
        </div>
        <div className="border-b border-secondary pb-4">
            <h3 className="text-xl font-bold text-primary hover:text-red-700 cursor-pointer">Bí Quyết Viết Tiêu Đề Video "Ăn Tiền" Với Trợ Lý AI Của YT Pro Tools</h3>
            <p className={commonTextStyle}>Tiêu đề là yếu tố quyết định 80% lượt nhấp chuột. Chúng tôi sẽ chỉ cho bạn cách tận dụng công cụ AI để tạo ra những tiêu đề không thể cưỡng lại...</p>
        </div>
        <div>
            <h3 className="text-xl font-bold text-primary hover:text-red-700 cursor-pointer">Phân Tích Đối Thủ Cạnh Tranh: Bước Đi Sống Còn Để Thống Trị Thị Trường Ngách Của Bạn</h3>
            <p className={commonTextStyle}>Học hỏi từ người thành công (và cả người thất bại) là cách nhanh nhất để phát triển. Công cụ phân tích của chúng tôi sẽ cho bạn thấy mọi bí mật của đối thủ...</p>
        </div>
    </div>
);

export const TermsOfServiceContent: React.FC = () => (
  <div className={commonTextStyle}>
    <p><em>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</em></p>
    <p>Vui lòng đọc kỹ các Điều khoản Dịch vụ ("Điều khoản") này trước khi sử dụng trang web và dịch vụ của YT Pro Tools (gọi chung là "Dịch vụ") được điều hành bởi Công ty Cổ phần Dịch vụ Quốc tế NTC ("chúng tôi").</p>
    
    <h3 className={h3Style}>1. Chấp nhận Điều khoản</h3>
    <p>Bằng cách truy cập hoặc sử dụng Dịch vụ, bạn đồng ý bị ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, bạn không được phép truy cập Dịch vụ.</p>

    <h3 className={h3Style}>2. Mô tả Dịch vụ</h3>
    <p>YT Pro Tools cung cấp một bộ công cụ hỗ trợ các nhà sáng tạo nội dung trên YouTube. Các tính năng và chức năng của Dịch vụ có thể được sửa đổi, cập nhật hoặc ngừng cung cấp theo quyết định riêng của chúng tôi.</p>

    <h3 className={h3Style}>3. Đăng ký và Tài khoản</h3>
    <p>Bạn phải cung cấp thông tin chính xác và đầy đủ khi tạo tài khoản. Bạn chịu trách nhiệm hoàn toàn về việc bảo mật mật khẩu và mọi hoạt động diễn ra dưới tài khoản của mình.</p>
    
    <h3 className={h3Style}>4. Hành vi bị cấm</h3>
    <p>Bạn đồng ý không sử dụng Dịch vụ để: (a) Vi phạm bất kỳ luật hoặc quy định hiện hành nào; (b) Can thiệp hoặc phá vỡ tính toàn vẹn hoặc hiệu suất của Dịch vụ; (c) Cố gắng truy cập trái phép vào Dịch vụ hoặc các hệ thống liên quan; (d) Sử dụng Dịch vụ cho bất kỳ mục đích lừa đảo hoặc bất hợp pháp nào.</p>

    <h3 className={h3Style}>5. Quyền sở hữu trí tuệ</h3>
    <p>Dịch vụ và tất cả nội dung, tính năng và chức năng ban đầu của nó là và sẽ vẫn là tài sản độc quyền của Công ty Cổ phần Dịch vụ Quốc tế NTC và các bên cấp phép của nó. Dịch vụ được bảo vệ bởi bản quyền và các luật khác của cả Việt Nam và nước ngoài.</p>
    
    <h3 className={h3Style}>6. Chấm dứt</h3>
    <p>Chúng tôi có thể chấm dứt hoặc đình chỉ quyền truy cập của bạn vào Dịch vụ ngay lập tức, không cần thông báo trước hoặc chịu trách nhiệm, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn nếu bạn vi phạm Điều khoản.</p>

    <h3 className={h3Style}>7. Giới hạn Trách nhiệm</h3>
    <p>Trong mọi trường hợp, YT Pro Tools, cũng như giám đốc, nhân viên, đối tác, sẽ không chịu trách nhiệm pháp lý cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt nào phát sinh từ việc bạn truy cập hoặc sử dụng Dịch vụ.</p>
    
    <h3 className={h3Style}>8. Sửa đổi Điều khoản</h3>
    <p>Chúng tôi có quyền, theo quyết định riêng của mình, sửa đổi hoặc thay thế các Điều khoản này bất cứ lúc nào. Bằng cách tiếp tục truy cập hoặc sử dụng Dịch vụ của chúng tôi sau khi các sửa đổi đó có hiệu lực, bạn đồng ý bị ràng buộc bởi các điều khoản đã sửa đổi.</p>
  </div>
);

export const PrivacyPolicyContent: React.FC = () => (
  <div className={commonTextStyle}>
    <p><em>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</em></p>
    <p>Chính sách Bảo mật này mô tả cách chúng tôi thu thập, sử dụng và tiết lộ thông tin của bạn khi bạn sử dụng Dịch vụ của chúng tôi.</p>
    
    <h3 className={h3Style}>1. Các loại dữ liệu thu thập</h3>
    <p><strong>Dữ liệu cá nhân:</strong> Khi sử dụng Dịch vụ, chúng tôi có thể yêu cầu bạn cung cấp một số thông tin nhận dạng cá nhân nhất định, bao gồm nhưng không giới hạn ở: Tên, Địa chỉ Email.</p>
    <p><strong>Dữ liệu sử dụng:</strong> Chúng tôi thu thập thông tin về cách Dịch vụ được truy cập và sử dụng. Dữ liệu này có thể bao gồm địa chỉ IP, loại trình duyệt, các trang bạn truy cập, thời gian và ngày truy cập.</p>

    <h3 className={h3Style}>2. Sử dụng Dữ liệu của bạn</h3>
    <p>Chúng tôi sử dụng dữ liệu được thu thập cho các mục đích khác nhau:</p>
    <ul>
        <li>- Để cung cấp và duy trì Dịch vụ.</li>
        <li>- Để thông báo cho bạn về những thay đổi đối với Dịch vụ của chúng tôi.</li>
        <li>- Để cung cấp dịch vụ chăm sóc và hỗ trợ khách hàng.</li>
        <li>- Để cung cấp phân tích hoặc thông tin có giá trị để chúng tôi có thể cải thiện Dịch vụ.</li>
        <li>- Để theo dõi việc sử dụng Dịch vụ.</li>
        <li>- Để phát hiện, ngăn chặn và giải quyết các vấn đề kỹ thuật.</li>
    </ul>

    <h3 className={h3Style}>3. Sử dụng Cookies và Công nghệ Theo dõi</h3>
    <p>Chúng tôi sử dụng cookies và các công nghệ theo dõi tương tự để theo dõi hoạt động trên Dịch vụ của chúng tôi và giữ một số thông tin nhất định. Bạn có thể hướng dẫn trình duyệt của mình từ chối tất cả cookies hoặc cho biết khi nào cookie đang được gửi.</p>

    <h3 className={h3Style}>4. Tiết lộ Dữ liệu</h3>
    <p>Chúng tôi có thể tiết lộ Dữ liệu Cá nhân của bạn với niềm tin rằng hành động đó là cần thiết để: (a) Tuân thủ nghĩa vụ pháp lý; (b) Bảo vệ và bênh vực quyền hoặc tài sản của công ty; (c) Ngăn chặn hoặc điều tra các hành vi sai trái có thể có liên quan đến Dịch vụ.</p>
    
    <h3 className={h3Style}>5. Bảo mật Dữ liệu</h3>
    <p>An ninh dữ liệu của bạn rất quan trọng đối với chúng tôi, nhưng hãy nhớ rằng không có phương thức truyền qua Internet hoặc phương thức lưu trữ điện tử nào là an toàn 100%. Mặc dù chúng tôi cố gắng sử dụng các phương tiện được chấp nhận về mặt thương mại để bảo vệ Dữ liệu Cá nhân của bạn, chúng tôi không thể đảm bảo an ninh tuyệt đối.</p>

    <h3 className={h3Style}>6. Quyền của bạn</h3>
    <p>Bạn có quyền truy cập, cập nhật hoặc xóa thông tin chúng tôi có về bạn. Bất cứ khi nào có thể, bạn có thể truy cập, cập nhật hoặc yêu cầu xóa Dữ liệu Cá nhân của mình trực tiếp trong phần cài đặt tài khoản của bạn.</p>
    
    <h3 className={h3Style}>7. Liên kết đến các trang web khác</h3>
    <p>Dịch vụ của chúng tôi có thể chứa các liên kết đến các trang web khác không do chúng tôi điều hành. Nếu bạn nhấp vào một liên kết của bên thứ ba, bạn sẽ được chuyển đến trang web của bên thứ ba đó. Chúng tôi khuyên bạn nên xem lại Chính sách Bảo mật của mọi trang web bạn truy cập.</p>

    <h3 className={h3Style}>8. Thay đổi Chính sách Bảo mật này</h3>
    <p>Chúng tôi có thể cập nhật Chính sách Bảo mật của mình theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính sách Bảo mật mới trên trang này.</p>
  </div>
);

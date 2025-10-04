import React, { useState } from 'react';
import { 
    PercentageIcon, 
    CookieIcon, 
    CalendarIcon, 
    ChartIcon, 
    LinkIcon,
    UserPlusIcon,
    MouseClickIcon,
    DollarSignIcon
} from './IconComponents';
import { useAuth } from '../contexts/AuthContext';
import CustomGoogleSignInButton from './CustomGoogleSignInButton';

const commonTextStyle = "text-text-secondary leading-relaxed";
const h3Style = "text-xl font-bold text-text-main mt-6 mb-3";

const benefits = [
    {
        icon: <PercentageIcon className="w-8 h-8 text-accent"/>,
        title: "Hoa hồng 30% trọn đời",
        description: "Nhận 30% doanh thu từ mọi thanh toán của người dùng bạn giới thiệu, không chỉ lần đầu mà là mãi mãi."
    },
    {
        icon: <CookieIcon className="w-8 h-8 text-accent"/>,
        title: "Cookie 60 ngày",
        description: "Ngay cả khi người dùng không đăng ký ngay, bạn vẫn sẽ nhận được hoa hồng nếu họ quay lại trong vòng 60 ngày."
    },
    {
        icon: <CalendarIcon className="w-8 h-8 text-accent"/>,
        title: "Thanh toán hàng tháng",
        description: "Chúng tôi thanh toán hoa hồng đều đặn qua tài khoản ngân hàng hoặc PayPal vào ngày 15 hàng tháng."
    },
    {
        icon: <ChartIcon className="w-8 h-8 text-accent"/>,
        title: "Dashboard trực quan",
        description: "Theo dõi lượt nhấp, lượt đăng ký và doanh thu của bạn trong thời gian thực một cách dễ dàng."
    }
];

const FAQItem: React.FC<{q: string, a: string}> = ({q, a}) => (
    <details className="p-4 rounded-lg bg-background border border-secondary cursor-pointer">
        <summary className="font-semibold text-text-main">{q}</summary>
        <p className="text-text-secondary mt-2">{a}</p>
    </details>
)

const PublicAffiliatePage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-primary text-center">Kiếm Tiền Cùng YT Pro Tools</h2>
                <p className={`${commonTextStyle} text-center mt-2 max-w-2xl mx-auto`}>
                    Giới thiệu một công cụ tuyệt vời cho các nhà sáng tạo YouTube và nhận thưởng xứng đáng. Chương trình của chúng tôi đơn giản, minh bạch và được thiết kế vì sự thành công của bạn.
                </p>
            </div>

            <div className="p-6 bg-background rounded-xl border border-secondary">
                 <h3 className={h3Style + " mt-0 text-center"}>Tại Sao Nên Tham Gia?</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {benefits.map(item => (
                        <div key={item.title} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">{item.icon}</div>
                            <div>
                                <h4 className="font-bold text-text-main">{item.title}</h4>
                                <p className="text-text-secondary text-sm">{item.description}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            <div>
                <h3 className={h3Style + " text-center"}>Cách Hoạt Động Chỉ Trong 3 Bước</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-4">
                    <div className="p-4">
                        <div className="text-4xl font-bold text-primary mb-2">1</div>
                        <h4 className="font-bold text-text-main mb-1">Đăng Ký</h4>
                        <p className={commonTextStyle}>Tạo tài khoản miễn phí và tham gia chương trình chỉ với một cú nhấp chuột.</p>
                    </div>
                     <div className="p-4">
                        <div className="text-4xl font-bold text-primary mb-2">2</div>
                        <h4 className="font-bold text-text-main mb-1">Chia Sẻ</h4>
                        <p className={commonTextStyle}>Nhận liên kết giới thiệu độc quyền của bạn và chia sẻ nó với cộng đồng.</p>
                    </div>
                     <div className="p-4">
                        <div className="text-4xl font-bold text-primary mb-2">3</div>
                        <h4 className="font-bold text-text-main mb-1">Kiếm Tiền</h4>
                        <p className={commonTextStyle}>Nhận hoa hồng mỗi khi có người đăng ký gói trả phí qua liên kết của bạn.</p>
                    </div>
                </div>
            </div>

            <div>
                 <h3 className={h3Style + " text-center"}>Câu Hỏi Thường Gặp (FAQ)</h3>
                 <div className="space-y-4 max-w-3xl mx-auto">
                    <FAQItem q="Làm thế nào để đăng ký chương trình?" a="Rất đơn giản! Chỉ cần bạn có tài khoản YT Pro Tools, bạn có thể truy cập mục 'Affiliate' trong trang quản lý tài khoản và nhận liên kết giới thiệu ngay lập tức."/>
                    <FAQItem q="Tôi có thể kiếm được bao nhiêu tiền?" a="Không có giới hạn! Bạn nhận được 30% từ tất cả các khoản thanh toán của người dùng mà bạn giới thiệu, bao gồm cả các lần gia hạn. Càng giới thiệu nhiều, thu nhập của bạn càng cao."/>
                    <FAQItem q="Làm thế nào để theo dõi hiệu suất?" a="Chúng tôi cung cấp một trang quản lý (dashboard) riêng cho đối tác, nơi bạn có thể xem chi tiết số lượt nhấp, lượt chuyển đổi, và số tiền hoa hồng kiếm được theo thời gian thực."/>
                    <FAQItem q="Khi nào và làm thế nào tôi được thanh toán?" a="Chúng tôi sẽ thanh toán hoa hồng tích lũy của bạn vào ngày 15 hàng tháng, miễn là số dư của bạn đạt tối thiểu 500.000đ. Thanh toán được thực hiện qua chuyển khoản ngân hàng hoặc PayPal."/>
                 </div>
            </div>

            <div className="text-center pt-6 border-t border-secondary">
                 <h3 className="text-xl font-bold text-text-main">Sẵn Sàng Để Bắt Đầu?</h3>
                 <p className={`${commonTextStyle} mt-2 mb-6`}>Tham gia cùng hàng ngàn đối tác khác và bắt đầu tạo ra nguồn thu nhập thụ động ngay hôm nay!</p>
                 <CustomGoogleSignInButton className="bg-primary text-white hover:bg-red-700 px-6 py-3">
                    Đăng Ký Tham Gia Ngay
                 </CustomGoogleSignInButton>
            </div>
        </div>
    );
};

const AffiliateDashboard: React.FC<{affiliateId: string}> = ({ affiliateId }) => {
    const [copied, setCopied] = useState(false);
    const referralLink = `${window.location.origin}?ref=${affiliateId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const stats = [
        { icon: <MouseClickIcon className="w-8 h-8 text-sky-400" />, label: 'Lượt nhấp', value: '1,234' },
        { icon: <UserPlusIcon className="w-8 h-8 text-emerald-400" />, label: 'Lượt đăng ký', value: '56' },
        { icon: <PercentageIcon className="w-8 h-8 text-amber-400" />, label: 'Tỷ lệ chuyển đổi', value: '4.54%' },
        { icon: <DollarSignIcon className="w-8 h-8 text-rose-500" />, label: 'Hoa hồng (chưa thanh toán)', value: '1.250.000đ' },
    ];
    
    const payouts = [
        { date: '15/07/2024', amount: '2,580,000đ', status: 'Đã thanh toán', method: 'PayPal' },
        { date: '15/06/2024', amount: '1,950,000đ', status: 'Đã thanh toán', method: 'PayPal' },
        { date: '15/05/2024', amount: '1,420,000đ', status: 'Đã thanh toán', method: 'Bank Transfer' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-primary">Link Giới Thiệu Của Bạn</h2>
                <p className={commonTextStyle}>Chia sẻ link này để bắt đầu kiếm tiền. Mỗi lượt đăng ký thành công qua link này sẽ được ghi nhận cho bạn.</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input 
                        type="text"
                        readOnly
                        value={referralLink}
                        className="w-full bg-background border border-secondary rounded-lg px-4 py-2 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button 
                        onClick={handleCopy}
                        className="flex-shrink-0 bg-accent hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-300"
                    >
                        {copied ? 'Đã sao chép!' : 'Sao chép'}
                    </button>
                </div>
            </div>

            <div className="pt-6 border-t border-secondary">
                 <h3 className="text-2xl font-bold text-primary mb-4">Thống Kê Hiệu Suất</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(stat => (
                        <div key={stat.label} className="bg-background border border-secondary rounded-lg p-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">{stat.icon}</div>
                            <div>
                                <p className="text-sm text-text-secondary">{stat.label}</p>
                                <p className="text-xl font-bold text-text-main">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                 </div>
                 <p className="text-xs text-text-secondary mt-4 italic">*Dữ liệu được cập nhật theo thời gian thực. Các chỉ số trên là dữ liệu mô phỏng.</p>
            </div>
            
            <div className="pt-6 border-t border-secondary">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                    <h3 className="text-2xl font-bold text-primary">Lịch Sử Thanh Toán</h3>
                    <button onClick={() => alert('Chức năng đang được phát triển!')} className="bg-secondary text-text-main hover:bg-gray-700 font-semibold px-4 py-2 rounded-lg text-sm">
                        Cài đặt thanh toán
                    </button>
                 </div>
                 <div className="bg-background border border-secondary rounded-lg overflow-hidden">
                     <table className="w-full text-left">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-text-main">Ngày</th>
                                <th className="p-3 text-sm font-semibold text-text-main hidden sm:table-cell">Số tiền</th>
                                <th className="p-3 text-sm font-semibold text-text-main hidden md:table-cell">Phương thức</th>
                                <th className="p-3 text-sm font-semibold text-text-main">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {payouts.map(p => (
                                <tr key={p.date}>
                                    <td className="p-3 text-text-secondary">{p.date}</td>
                                    <td className="p-3 text-text-main font-medium hidden sm:table-cell">{p.amount}</td>
                                    <td className="p-3 text-text-secondary hidden md:table-cell">{p.method}</td>
                                    <td className="p-3">
                                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">{p.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
}

const AffiliateProgram: React.FC = () => {
    const { user, affiliateId } = useAuth();
    
    if (user && affiliateId) {
        return <AffiliateDashboard affiliateId={affiliateId} />;
    }
    
    return <PublicAffiliatePage />;
};

export default AffiliateProgram;

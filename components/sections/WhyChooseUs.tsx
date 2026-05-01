import "./WhyChooseUs.css";

const features = [
  {
    icon: "🆓",
    title: "Free Worksheets",
    desc: "Download unlimited printable worksheets at no cost. No hidden fees, ever.",
  },
  {
    icon: "🎯",
    title: "Easy for Kids",
    desc: "Simple and fun learning designed for young students to enjoy and grow.",
  },
  {
    icon: "📚",
    title: "All Subjects",
    desc: "Math, English, General Knowledge and more — all in one place.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-container">

        {/* Label */}
        <span className="why-label">Why Dynoba</span>

        {/* Heading */}
        <h2 className="why-heading">Why Choose Us</h2>

        {/* Subtext */}
        <p className="why-subtext">
          We provide simple and effective learning worksheets for kids —
          free, fun, and ready to print.
        </p>

        {/* Cards */}
        <div className="why-grid">
          {features.map((item, i) => (
            <div key={i} className="why-card">
              <div className="why-card-icon">{item.icon}</div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
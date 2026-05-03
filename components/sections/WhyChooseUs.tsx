import "./WhyChooseUs.css";
import { Target, Zap, Activity, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
  return (
    <section className="why-section" id="why-choose-us">
      <div className="why-container">
        <h2 className="why-heading">Why Learning Path?</h2>
        <p className="why-subtext">
          Our methodology strips away the noise, focusing strictly on
          comprehension and academic progression.
        </p>

        <div className="bento-grid">
          {/* Card 1: Distraction-Free Focus */}
          <div className="bento-card card-large">
            <div className="card-icon-wrapper icon-blue">
              <Target size={24} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Distraction-Free Focus</h3>
              <p className="card-desc">
                Our minimalist interface reduces cognitive load, allowing
                you to absorb complex information without unnecessary visual clutter.
              </p>
            </div>
            <div className="card-bg-icon">
              <Zap size={120} strokeWidth={0.5} />
            </div>
          </div>

          {/* Card 2: Paced Progression */}
          <div className="bento-card card-small">
            <div className="card-icon-wrapper icon-red">
              <Zap size={22} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Paced Progression</h3>
              <p className="card-desc">
                Step-by-step curriculum design ensuring mastery before moving to advanced concepts.
              </p>
            </div>
          </div>

          {/* Card 3: Clear Analytics */}
          <div className="bento-card card-small">
            <div className="card-icon-wrapper icon-yellow">
              <Activity size={22} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Clear Analytics</h3>
              <p className="card-desc">
                Transparent tracking of your academic milestones and areas needing review.
              </p>
            </div>
          </div>

          {/* Card 4: Structured Methodology (Blue) */}
          <div className="bento-card card-large card-blue">
            <div className="card-content">
              <h3 className="card-title">Structured Methodology</h3>
              <p className="card-desc">
                Built on proven pedagogical frameworks that emphasize deep
                understanding over rote memorization.
              </p>
            </div>
            <div className="card-bg-decoration">
              <div className="deco-circle circle-1" />
              <div className="deco-circle circle-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
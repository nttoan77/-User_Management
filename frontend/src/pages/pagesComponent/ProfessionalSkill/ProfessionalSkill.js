// ProfessionalSkill.jsx
import { useInView } from "react-intersection-observer";
import classNames from "classnames/bind";
import styles from "./ProfessionalSkill.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaTools, FaUsers } from "react-icons/fa"; // Thêm icons từ react-icons (npm install react-icons)

const cx = classNames.bind(styles);

const LEVEL_LABEL = {
  beginner: "Cơ bản",
  intermediate: "Trung bình",
  advanced: "Nâng cao",
  expert: "Chuyên gia",
};

const LEVEL_PERCENT = {
  beginner: 35,
  intermediate: 65,
  advanced: 85,
  expert: 100,
};

const LEVEL_TOOLTIP = {
  beginner: "Mới bắt đầu, kiến thức cơ bản.",
  intermediate: "Có kinh nghiệm, xử lý được các nhiệm vụ trung bình.",
  advanced: "Nâng cao, giải quyết vấn đề phức tạp.",
  expert: "Chuyên gia, dẫn dắt và tối ưu hóa.",
};

function ProfessionalSkill({ data }) {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  if (!Array.isArray(data) || data.length === 0) {
    return <div className={cx("empty")}>Chưa có kỹ năng nào được thêm.</div>;
  }

  const hardSkills = data.filter((s) => s.category === "hard");
  const softSkills = data.filter((s) => s.category === "soft");

  const getOffset = (level) => {
    const percent = LEVEL_PERCENT[level] || 50;
    return 314 - (314 * percent) / 100;
  };

  const renderDescriptionTags = (description, isSoft = false) => {
    if (!description) {
      return <span className={cx("noDetail")}>Chưa có mô tả kỹ năng</span>;
    }

    return description
      .split(/[,;\n]/)
      .map((item, idx) => (
        <span
          key={idx}
          className={cx("detailTag", { soft: isSoft })}
        >
          {item.trim()}
        </span>
      ));
  };

  return (
    <section ref={ref} className={cx("wrapper", { animate: inView })}>
      <div className={cx("container")}>
        <h2 className={cx("title")}>Kỹ năng chuyên môn</h2>

        {/* HARD SKILLS */}
        {hardSkills.length > 0 && (
          <div className={cx("section", "hard")}>
            <h3 className={cx("category")}>
              <FaTools className={cx("categoryIcon")} /> Kỹ năng cứng
            </h3>
            <div className={cx("skillsGrid")}>
              {hardSkills.map((skill, i) => (
                <div key={i} className={cx("skillCard")} style={{ "--i": i }}>
                  <div className={cx("circleWrapper")}>
                    <div className={cx("circle")}>
                      <svg viewBox="0 0 120 120">
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>
                        <circle className={cx("bg")} cx="60" cy="60" r="50" />
                        <circle
                          className={cx("progress")}
                          cx="60"
                          cy="60"
                          r="50"
                          style={{ "--offset": `${getOffset(skill.level)}px` }}
                        />
                      </svg>
                      <div className={cx("percent")}>
                        {LEVEL_PERCENT[skill.level]}%
                      </div>
                    </div>
                  </div>

                  <h4 className={cx("skillName")}>{skill.name}</h4>
                  <span className={cx("levelBadge")} title={LEVEL_TOOLTIP[skill.level]}>
                    {LEVEL_LABEL[skill.level]}
                  </span>

                  <div className={cx("details")}>
                    {renderDescriptionTags(skill.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOFT SKILLS */}
        {softSkills.length > 0 && (
          <div className={cx("section", "soft")}>
            <h3 className={cx("category")}>
              <FaUsers className={cx("categoryIcon")} /> Kỹ năng mềm
            </h3>
            <div className={cx("softGrid")}>
              {softSkills.map((skill, i) => (
                <div key={i} className={cx("softCard")} style={{ "--i": i }}>
                  <div className={cx("softHeader")}>
                    <h4 className={cx("skillName")}>{skill.name}</h4>
                    <span className={cx("levelBadge", "soft")} title={LEVEL_TOOLTIP[skill.level]}>
                      {LEVEL_LABEL[skill.level]}
                    </span>
                  </div>

                  <div className={cx("details")}>
                    {renderDescriptionTags(skill.description, true)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfessionalSkill;
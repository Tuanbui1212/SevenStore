import { useState } from "react";
import styles from "./HelpCenter.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";

const supportTopics = [
  {
    icon: "fa-solid fa-truck-fast",
    title: "Shipping & Delivery",
    link: "/help/shipping",
  },
  { icon: "fa-solid fa-box-open", title: "Returns", link: "/help/returns" },
  {
    icon: "fa-solid fa-ruler-combined",
    title: "Size Charts",
    link: "/help/size-guide",
  },
  {
    icon: "fa-solid fa-credit-card",
    title: "Payment Options",
    link: "/help/payment",
  },
  { icon: "fa-solid fa-user-gear", title: "My Account", link: "/account" },
  { icon: "fa-solid fa-tags", title: "Promotions", link: "/help/promos" },
];

const faqs = [
  {
    question: "Where is my order?",
    answer:
      "You can check the status of your order by logging into your account and visiting the 'Orders' section. If you guest checkout, check your email for the tracking link.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with original tags attached. Footwear must be in the original box.",
  },
  {
    question: "How do I find the right size?",
    answer:
      "We recommend checking our Size Chart available on every product page. If you are between sizes, we generally suggest going up half a size for comfort.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location.",
  },
];

function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={clsx("container", styles.helpCenter)}>
      <div className={styles.hero}>
        <h1 className={styles.hero__title}>GET HELP</h1>
        <div className={styles.hero__search}>
          <input type="text" placeholder="What can we help you with?" />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.section__title}>QUICK ASSIST</h3>
        <div className={styles.grid}>
          {supportTopics.map((topic, index) => (
            <Link key={index} className={styles.card}>
              <i className={clsx(topic.icon, styles.card__icon)}></i>
              <span className={styles.card__text}>{topic.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.section__title}>FREQUENTLY ASKED QUESTIONS</h3>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={clsx(
                styles.faqItem,
                openIndex === index && styles.active
              )}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <i
                  className={clsx(
                    "fa-solid",
                    openIndex === index ? "fa-minus" : "fa-plus"
                  )}
                ></i>
              </button>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contact}>
        <h3>STILL NEED HELP?</h3>
        <p>Our team is available Mon-Fri, 9am - 6pm.</p>
        <div className={styles.contact__buttons}>
          <button className={styles.btnPrimary}>
            <i className="fa-regular fa-comment-dots"></i> CHAT WITH US
          </button>
          <button className={styles.btnSecondary}>
            <i className="fa-solid fa-envelope"></i> EMAIL US
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;

import type { CSSProperties } from "react";
import { Header } from "@/components/header";
import { InquiryForm } from "@/components/inquiry-form";
import { getMenu, formatPrice, type MenuItem } from "@/lib/menu";
import { restaurant, externalUrl } from "@/lib/restaurant";
import { inquiriesEnabled } from "@/lib/supabase";
import { embeddedImages } from "@/lib/embedded-images";

export const dynamic = "force-dynamic";

const fallbackMenu: MenuItem[] = [
  {
    id: "thai-iced-tea",
    name: "Thai Iced Tea",
    description:
      "Strong-brewed Thai tea mixed with sweetened condensed milk and served over ice - rich, sweet, and creamy.",
    category: "Drinks",
    price: 9,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "nom-yen",
    name: "Nom Yen",
    description:
      "A sweet and creamy iced milk drink made with sala syrup - vibrant, nostalgic, and refreshing.",
    category: "Drinks",
    price: 8,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "oliang",
    name: "O-Liang",
    description:
      "Bold Thai-style black coffee served over ice with a slightly smoky, deeply aromatic finish.",
    category: "Drinks",
    price: 8,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "chive-dumplings",
    name: "Crispy Fried Chive Dumplings",
    description:
      "Golden-fried dumplings filled with aromatic Chinese chives and served with soy-vinegar dipping sauce.",
    category: "Appetizers",
    price: 10,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "gyoza",
    name: "Crispy Fried Gyoza",
    description:
      "Golden pan-fried pork dumplings, crispy outside and juicy inside, with classic soy-vinegar sauce.",
    category: "Appetizers",
    price: 10,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "spicy-mala-dumplings",
    name: "Spicy Mala Pork Dumplings",
    description:
      "House-made pork dumplings topped with bold numbing mala chili sauce and crushed peanuts.",
    category: "Appetizers",
    price: 14,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "chicken-satay",
    name: "Chicken Satay",
    description:
      "Grilled chicken satay marinated in coconut milk and curry spice, served with cucumber relish and peanut dipping sauce.",
    category: "Appetizers",
    price: 14,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "egg-rolls",
    name: "Egg Rolls",
    description:
      "Crispy fried egg rolls filled with vegetables and glass noodles, served with sweet chili sauce.",
    category: "Appetizers",
    price: 9,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "tamarind-wings",
    name: "Tamarind Wings",
    description:
      "Crispy fried chicken wings glazed in a sweet and tangy tamarind sauce.",
    category: "Appetizers",
    price: 13,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "green-curry",
    name: "Green Curry",
    description:
      "Rich Thai green curry simmered in coconut milk with eggplant, sweet basil, and fragrant Thai herbs.",
    category: "Soups & Curries",
    price: 20,
    currency: "USD",
    dietary_labels: ["Tofu $20", "Chicken $22", "Beef $24", "Shrimp $27"],
  },
  {
    id: "tom-yum",
    name: "Tom Yum Koong",
    description:
      "Spicy shrimp soup with coconut, lemongrass, and a bright, tangy Thai broth.",
    category: "Soups & Curries",
    price: 26,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "tom-kha",
    name: "Tom Kha Gai",
    description:
      "Thai chicken coconut soup with tender chicken, aromatic herbs, lemongrass, and coconut milk.",
    category: "Soups & Curries",
    price: 23,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "panang-beef",
    name: "Panang Beef",
    description:
      "Tender beef simmered in rich panang curry with coconut milk, kaffir lime leaves, and crushed peanuts.",
    category: "Soups & Curries",
    price: 26,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "pad-thai",
    name: "Pad Thai",
    description:
      "Thailand's iconic stir-fried rice noodles with tamarind sauce, bean sprouts, chives, and crushed peanuts.",
    category: "Noodles & Rice",
    price: 21,
    currency: "USD",
    dietary_labels: ["Tofu or chicken $21", "Beef $24", "Shrimp $26"],
  },
  {
    id: "shallot-fried-rice",
    name: "Shallot Fried Rice",
    description:
      "A signature fried rice with roasted red pork, cranberries, corn, peas, and crispy fried shallots.",
    category: "Noodles & Rice",
    price: 25,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    description:
      "Classic Thai fried rice wok-tossed with egg, onion, and tomato.",
    category: "Noodles & Rice",
    price: 21,
    currency: "USD",
    dietary_labels: ["Chicken $21", "Beef $23", "Shrimp $24", "Crab $25"],
  },
  {
    id: "pineapple-fried-rice",
    name: "Pineapple Fried Rice",
    description:
      "Fried rice tossed with pineapple, cashews, raisins, and curry powder for a bold, sweet-savory finish.",
    category: "Noodles & Rice",
    price: 24,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "pad-ka-proa",
    name: "Pad Ka Proa",
    description:
      "A fiery Thai favorite with holy basil, garlic, and three kinds of chilies. Perfect with steamed rice.",
    category: "Stir-Fried",
    price: 24,
    currency: "USD",
    dietary_labels: ["Chicken $24", "Beef $26"],
  },
  {
    id: "cashew-chicken",
    name: "Cashew Chicken",
    description:
      "Tender chicken with roasted cashews, ginkgo nuts, bell peppers, onions, and dried chilies.",
    category: "Stir-Fried",
    price: 25,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "pad-pak-goong",
    name: "Pad Pak Goong",
    description:
      "Stir-fried morning glory with shrimp, garlic, and chili in a savory Thai sauce.",
    category: "Stir-Fried",
    price: 24,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "stir-fried-black-pepper",
    name: "Stir-Fried Black Pepper",
    description:
      "Wok-tossed with garlic, onions, bell peppers, and cracked black pepper sauce.",
    category: "Stir-Fried",
    price: 22,
    currency: "USD",
    dietary_labels: ["Chicken $22", "Beef $25"],
  },
  {
    id: "crispy-seabass",
    name: "Crispy Seabass with Tamarind Sauce",
    description:
      "Golden fried seabass topped with tangy tamarind sauce and crispy fried shallots.",
    category: "Seafood & Over Rice",
    price: 34,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "braised-chicken-rice",
    name: "Braised Chicken Over Rice",
    description:
      "Tender chicken simmered in delicate broth with sesame oil and served over steamed jasmine rice.",
    category: "Seafood & Over Rice",
    price: 22,
    currency: "USD",
    dietary_labels: [],
  },
  {
    id: "mango-sticky-rice",
    name: "Mango Sticky Rice",
    description:
      "Fragrant coconut sticky rice served with ripe mango slices and rich coconut sauce.",
    category: "Dessert",
    price: 18,
    currency: "USD",
    dietary_labels: [],
  },
];

function getMenuItems(items: MenuItem[]) {
  return items.length > 0 ? items : fallbackMenu;
}

export default async function Home() {
  const menu = await getMenu();
  const menuItems = getMenuItems(menu.items);
  const orderUrl = externalUrl(restaurant.orderUrl);
  const directionsUrl = externalUrl(restaurant.directionsUrl);
  const categories = [...new Set(menuItems.map((item) => item.category))];
  const imageStyles = {
    "--selected-story": `url("${embeddedImages.selectedStory}")`,
  } as CSSProperties;

  return (
    <>
      <Header />
      <main id="main" className="site-main" style={imageStyles}>
        <section id="home" className="hero">
          <img
            className="hero-photo"
            src="/images/pad-thai-hero.jpg"
            alt=""
            aria-hidden="true"
          />
          <div className="hero-overlay" />
          <div className="hero-noise" />
          <div className="hero-inner section-shell">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                Thai food <span>Good people</span> Clearwater Beach
              </p>
              <div className="hero-logo" aria-label="Shallot Savory Thai">
                <span>Shallot</span>
                <b aria-hidden="true">Savory Thai</b>
                <span className="hero-logo-divider" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24">
                    <path d="M12 20c-3.2-2.4-3.6-6.6-3.6-6.6s4 .3 3.6 6.6z" fill="currentColor" opacity=".85" />
                    <path d="M12 20c3.2-2.4 3.6-6.6 3.6-6.6s-4 .3-3.6 6.6z" fill="currentColor" opacity=".85" />
                    <path d="M12 20c-.4-4.6.6-8.4.6-8.4s1 3.8.6 8.4z" fill="currentColor" opacity=".85" />
                  </svg>
                </span>
              </div>
              <h1>Thai flavors, handmade with Pim&apos;s creative touch.</h1>
              <p>
                Fresh ingredients. Bold flavor. A little piece of Thailand by
                Clearwater Beach, brought to life by Pim.
              </p>
              <div className="actions">
                <a className="button button-red" href="#menu">
                  View menu <span aria-hidden="true">-&gt;</span>
                </a>
                <a className="button button-ghost" href="#visit">
                  Get directions
                </a>
              </div>
            </div>
            <div className="hero-asides" aria-hidden="true">
              <p>Good food<br />brighter people</p>
              <p>Simple ingredients<br />extraordinary people</p>
            </div>
          </div>
        </section>

        <section id="story" className="pim-intro">
          <div className="section-shell intro-grid">
            <figure className="pim-photo-card">
              <img
                src="/images/pim-cooking.jpg"
                alt="Pim cooking at the wok in the Shallot kitchen"
                loading="eager"
              />
            </figure>
            <div className="intro-copy">
              <p className="eyebrow">The heart behind Shallot</p>
              <h2>Meet Pim</h2>
              <p className="lead">
                Food is how Pim shares her heart.
              </p>
              <p>
                Behind every dish at Shallot is Pim, a Thai woman with a love
                for cooking, creativity, and art. For Pim, cooking has always
                been more than following a recipe. It is another way to express
                herself.
              </p>
              <p>
                She creates each menu item with care, bringing together the Thai
                flavors she loves with her own creative touch.
              </p>
              <p className="hand-note">Good food creates a kinder, brighter world. - Pim</p>
            </div>
          </div>
        </section>

        <section id="menu" className="menu-section section-space">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">From Pim&apos;s kitchen</p>
                <h2>Menu highlights</h2>
              </div>
              <p>
                Handmade Thai dishes made fresh to order, from bold curries to
                comforting noodles. Ask your server about seasonal specials.
              </p>
            </div>

            <div className="menu-board">
              {categories.map((category) => (
                <section className="menu-category" key={category}>
                  <h3>{category}</h3>
                  <div className="menu-items">
                    {menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <article className="menu-item" key={item.id}>
                          <div className="menu-item-title">
                            <h4>{item.name}</h4>
                            <span>{formatPrice(item.price, item.currency)}</span>
                          </div>
                          <p>{item.description}</p>
                          {item.dietary_labels.length > 0 && (
                            <p className="dietary">{item.dietary_labels.join(" / ")}</p>
                          )}
                        </article>
                      ))}
                  </div>
                </section>
              ))}
            </div>
            <p className="menu-note">
              Please ask the team about ingredients, allergies, and current menu
              availability before ordering.
            </p>
          </div>
        </section>

        <section id="pim" className="pim-feature section-space">
          <div className="section-shell pim-feature-grid">
            <div className="pim-story">
              <p className="eyebrow">Pim&apos;s story</p>
              <h2>Every plate tells a little piece of her story.</h2>
              <p>
                Pim wants Shallot to feel more than just a restaurant. She wants
                it to be a place where people feel welcome, enjoy good food, and
                experience a little bit of Thai culture and her personality along
                the way.
              </p>
              <p>
                In many ways, Pim is the heart - and even the mascot - of
                Shallot: warm, colorful, creative, and always excited to share
                what she loves.
              </p>
            </div>
            <figure className="portrait-frame">
              <img
                src={embeddedImages.pimPortrait}
                alt="Pim, chef and heart behind Shallot Savory Thai"
                loading="lazy"
              />
              <figcaption>Pim, the heart behind Shallot</figcaption>
            </figure>
          </div>
        </section>

        <section id="reviews" className="reviews-section section-space">
          <div className="section-shell reviews-grid">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2>Good Thai food brings people together.</h2>
            </div>
            <div className="review-card">
              <p>
                Loved your visit? A quick review helps other neighbors find us
                and lets Pim know how she did.
              </p>
              <a
                className="button button-red"
                href="https://www.google.com/search?q=Shallot+Savory+Thai+Clearwater+FL+reviews"
                target="_blank"
                rel="noopener noreferrer"
              >
                Leave a Google review
              </a>
            </div>
          </div>
        </section>

        <section id="visit" className="visit-section section-space">
          <div className="section-shell visit-grid">
            <div>
              <p className="eyebrow">Visit</p>
              <h2>Clearwater Beach Thai kitchen, good company.</h2>
              <p>
                Come for handmade Thai flavors, a warm welcome, and Pim&apos;s
                creative touch.
              </p>
              <div className="actions">
                {directionsUrl && (
                  <a
                    className="button button-red"
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                  </a>
                )}
                {restaurant.phone && (
                  <a
                    className="button button-ghost"
                    href={`tel:${restaurant.phone.replace(/[^+\d]/g, "")}`}
                  >
                    Call {restaurant.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="visit-details">
              <div className="detail-block">
                <h3>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.4" />
                  </svg>
                  Find Shallot
                </h3>
                <p>{restaurant.address || "Clearwater Beach address to be added"}</p>
                {directionsUrl ? (
                  <a
                    className="text-link"
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                  </a>
                ) : (
                  <span className="unavailable">Directions link to be added</span>
                )}
              </div>
              <div className="detail-block">
                <h3>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3.2 2" />
                  </svg>
                  Hours
                </h3>
                {restaurant.hours.length ? (
                  <dl className="hours">
                    {restaurant.hours.map((row) => (
                      <div key={row.days}>
                        <dt>{row.days}</dt>
                        <dd>{row.time}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p>Opening days and hours to be added</p>
                )}
              </div>
              <div className="detail-block" id="ordering">
                <h3>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.2 2.2z" />
                  </svg>
                  Order
                </h3>
                {orderUrl ? (
                  <a
                    className="button button-red"
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order online
                  </a>
                ) : (
                  <>
                    <p>Call ahead for pickup or to reserve a table.</p>
                    <span className="unavailable">
                      Online ordering coming soon — Uber Eats, DoorDash, or direct ordering.
                    </span>
                  </>
                )}
                <p className="phone">
                  {restaurant.phone ? (
                    <a href={`tel:${restaurant.phone.replace(/[^+\d]/g, "")}`}>
                      {restaurant.phone}
                    </a>
                  ) : (
                    "Phone number to be added"
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-shell section-space">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Questions, catering, or a note for the team.</h2>
            <p>
              Planning a get-together or just want to say hi? Send us a note
              and the team will get back to you.
            </p>
          </div>
          <InquiryForm enabled={inquiriesEnabled()} />
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="wordmark" href="#home">
          <span>Shallot</span>
          <b>Savory Thai</b>
        </a>
        <p>Thai food. Good people. Brighter days.</p>
        <a className="text-link" href="#home">
          Back to top
        </a>
      </footer>
    </>
  );
}




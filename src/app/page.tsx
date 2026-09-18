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
    id: "moo-sate",
    name: "Moo Sa-Te",
    description:
      "Grilled pork satay marinated in coconut milk and curry spice, served with cucumber relish and peanut dipping sauce.",
    category: "Appetizers",
    price: 14,
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
    price: 15,
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
    "--selected-hero": `url("${embeddedImages.selectedHero}")`,
    "--selected-story": `url("${embeddedImages.selectedStory}")`,
  } as CSSProperties;

  return (
    <>
      {process.env.PREVIEW_MODE !== "false" && (
        <div className="preview-banner">
          Website preview for Shallot Thai Kitchen
        </div>
      )}
      <Header />
      <main id="main" className="site-main" style={imageStyles}>
        <section id="home" className="hero">
          <div className="hero-overlay" />
          <div className="hero-noise" />
          <div className="hero-inner section-shell">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                Thai food <span>Good people</span> Clearwater Beach
              </p>
              <div className="hero-logo" aria-label="Shallot Thai Kitchen">
                <span>Shallot</span>
                <b aria-hidden="true">Thai Kitchen</b>
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
                src={embeddedImages.pimCooking}
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
                The online menu should feel rich, polished, and easy to scan on
                a phone. Prices are shown from the current photographed menu and
                should be confirmed before launch.
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
                alt="Pim, chef and heart behind Shallot Thai Kitchen"
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
                A simple review button can live here once the Google Business
                Profile link is ready.
              </p>
              <a className="button button-red" href="#visit">
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
            </div>
            <div className="visit-details">
              <div className="detail-block">
                <h3>Find Shallot</h3>
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
                <h3>Hours</h3>
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
                <h3>Order</h3>
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
                    <p>Online ordering link to be added</p>
                    <span className="unavailable">
                      Uber Eats, DoorDash, or direct ordering can be connected later.
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
              This form can be connected once the restaurant email and Supabase
              settings are confirmed.
            </p>
          </div>
          <InquiryForm enabled={inquiriesEnabled()} />
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="wordmark" href="#home">
          <span>Shallot</span>
          <b>Thai Kitchen</b>
        </a>
        <p>Thai food. Good people. Brighter days.</p>
        <a className="text-link" href="#home">
          Back to top
        </a>
      </footer>
    </>
  );
}



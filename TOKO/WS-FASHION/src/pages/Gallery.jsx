export default function Gallery() {
  const blocks = [
    {
      id: "01",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b??auto=format&fit=crop&w=500&q=50",
    },
    {
      id: "02",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=50",
    },
    {
      id: "03",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=50",
    },
    {
      id: "04",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=500&q=50",
    },
    {
      id: "05",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=50",
    },
    {
      id: "06",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=50",
    },
  ];

  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">GALLERY / 09</p>

          <h1>
            VISUAL
            <br />
            <em>STORIES.</em>
          </h1>

          <p>
            Explore our latest fashion campaigns, everyday looks,
            and visual stories from WS FASHION.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container gallery-grid">
          {blocks.map((item, i) => (
            <div
              className={`gallery-tile tile-${i + 1}`}
              key={item.id}
            >
              <img
                src={item.image}
                alt={`WS Fashion Look ${item.id}`}
                loading="lazy"
              />

              <span>{item.id}</span>

              <small>
                FASHION / LOOK {item.id}
              </small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
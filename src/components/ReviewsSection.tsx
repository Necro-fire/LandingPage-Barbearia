import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import review3 from "@/assets/review-3.jpg";
import review4 from "@/assets/review-4.jpg";

const reviews = [review1, review2, review3, review4];

const ReviewsSection = () => (
  <section id="reviews" className="section-padding">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Depoimentos</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Avaliações no Google</h2>
        <div className="gold-line mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {reviews.map((src, i) => (
          <div
            key={i}
            className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(191,155,81,0.12)] group"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={src}
                alt={`Avaliação de cliente ${i + 1}`}
                loading="lazy"
                width={800}
                height={512}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;

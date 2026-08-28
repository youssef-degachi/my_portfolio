import { motion } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientWorkSlider from "@/components/ClientWorkSlider";
import { visibleWorkByKind, WORK_KIND } from "@/data/work";

const ProductCard = ({ item }) => {
  return (
    <article className="flex flex-col justify-between min-h-[320px] p-8 rounded-xl bg-[#232329] border border-white/5 hover:border-accent-default/40 transition-colors duration-300">
      <div>
        <div className="w-16 h-16 mb-6 rounded-full border border-accent-default text-accent-default flex items-center justify-center text-2xl font-semibold">
          {item.image ? (
            <img src={item.image} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            item.mark
          )}
        </div>
        <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
        <p className="text-white/60 mb-3">{item.tagline}</p>
        <p className="text-sm text-white/40 mb-6">{item.role}</p>
        <ul className="flex flex-wrap gap-2 mb-6">
          {item.stack.map((tag) => (
            <li
              key={tag}
              className="text-xs uppercase tracking-wide text-accent-default border border-accent-default/30 rounded-full px-3 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      {item.live && (
        <a
          href={item.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent-default hover:text-accent-hover transition-colors"
        >
          Visit site
          <BsArrowUpRight />
        </a>
      )}
    </article>
  );
};

const Work = () => {
  const products = visibleWorkByKind(WORK_KIND.PRODUCT);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 1.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="flex flex-row w-full max-w-[420px] mx-auto mb-12 gap-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="client">Client work</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="w-full min-h-0">
            <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
              Products I co-founded and ship.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {products.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="client" className="w-full min-h-0">
            <ClientWorkSlider />
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default Work;

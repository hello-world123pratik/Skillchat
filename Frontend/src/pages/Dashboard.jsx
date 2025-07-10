import { Link } from "react-router-dom";
import { Users, Globe, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const cards = [
    {
      title: "My Groups",
      description: "Manage the groups you’re currently part of.",
      icon: <Users className="w-7 h-7 text-blue-600" />,
      link: "/my-groups",
    },
    {
      title: "All Groups",
      description: "Explore and join public groups across SkillSync.",
      icon: <Globe className="w-7 h-7 text-blue-600" />,
      link: "/groups",
    },
    {
      title: "Create Group",
      description: "Start a new group and collaborate with peers.",
      icon: <PlusCircle className="w-7 h-7 text-blue-600" />,
      link: "/groups/create",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to <span className="text-blue-600">SkillSync</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Build, lead, and collaborate inside learning communities tailored for skill growth.
          </p>
        </motion.div>

        {/* Fancy Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Link
                to={card.link}
                className="relative rounded-2xl overflow-hidden group shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className="backdrop-blur-md bg-white/60 border border-gray-200 group-hover:bg-white/80 p-6 rounded-2xl transition duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-blue-600">{card.icon}</div>
                    <div className="text-sm text-blue-500 font-medium">View</div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">{card.title}</h2>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
}

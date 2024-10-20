import { motion } from "framer-motion";

const transitionVariants = {
  enter: {
    x: "100%",
    width: "100%",
  },
  center: {
    x: "0%",
    width: "0%",
  },
  exit: {
    x: ["0%", "100%"],
    width: ["0%", "100%"],
  },
};

const Transition = () => {
  return (
    <>
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-40 bg-red-900"
        variants={transitionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-red-700"
        variants={transitionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-[#e4002b]"
        variants={transitionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
      ></motion.div>
    </>
  );
};

export default Transition;

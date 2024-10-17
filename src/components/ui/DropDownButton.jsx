import { FiMoreVertical } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

const StaggeredDropDown = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center justify-center">
            <motion.div animate={open ? "open" : "closed"} className="relative">
                <button
                    onClick={() => setOpen((pv) => !pv)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 hover:bg-gray-100 transition-colors duration-300"
                >
                    <motion.span variants={iconVariants}>
                        <FiMoreVertical className="text-black text-lg"/>
                    </motion.span>
                </button>

                <motion.ul
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{ originY: "top", translateX: "-50%" }}
                    className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden border border-gray-300"
                >
                    <Option setOpen={setOpen} text="Abandonar clase" />
                </motion.ul>
            </motion.div>
        </div>
    );
};

const Option = ({ text, setOpen }) => {
    return (
        <motion.li
            variants={itemVariants}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-red-400 text-red-600 hover:text-white transition-colors duration-300 cursor-pointer"
        >
            <motion.span variants={actionIconVariants}>
            </motion.span>
            <span>{text}</span>
        </motion.li>
    );
};

export default StaggeredDropDown;

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
        },
    },
};

const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: "afterChildren",
        },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};

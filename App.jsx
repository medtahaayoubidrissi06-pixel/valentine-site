const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

const App = () => {
    const [accepted, setAccepted] = useState(false);
    const [noCount, setNoCount] = useState(0);
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const noBtnRef = useRef(null);

    // Initial random hearts background
    useEffect(() => {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.classList.add('bg-heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px';
            heart.style.animationDuration = Math.random() * 5 + 5 + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 10000);
        };
        const interval = setInterval(createHeart, 500);
        return () => clearInterval(interval);
    }, []);

    const handleNoHover = () => {
        setNoCount(prev => prev + 1);
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;
        setNoBtnPosition({ x, y });
    };

    const handleAccept = () => {
        setAccepted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ffa500', '#ffffff'] // Red, Orange, White
        });

        // Fireworks effect
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const noTexts = [
        "No",
        "Are you sure?",
        "Really?",
        "Pookie please?",
        "Think again!",
        "Last chance!",
        "Surely not?",
        "You might regret this!",
        "Give it another thought!",
        "Are you absolutely certain?",
        "This could be a mistake!",
        "Have a heart!",
        "Don't be so cold!",
        "Change of heart?",
        "Wouldn't you reconsider?",
        "Is that your final answer?",
        "You're breaking my heart ;(",
        "Pls playing hard to get",
    ];

    const getNoText = () => {
        return noTexts[Math.min(noCount, noTexts.length - 1)];
    };

    return (
        <div className="container">
            {!accepted ? (
                <div id="question-container">
                    <h1>Will you be my Valentine?</h1>
                    <div className="gif-container">
                        <img src="https://media.tenor.com/f1xnRxTRxLAAAAAj/bears-hugging.gif" alt="Cute bears" />
                    </div>
                    <div className="buttons">
                        <motion.button
                            className="yes-btn"
                            onClick={handleAccept}
                            style={{
                                transform: `scale(${1 + noCount * 0.1})` // Controlled growth
                            }}
                            whileHover={{ scale: 1.1 + noCount * 0.1 }}
                            whileTap={{ scale: 0.9 + noCount * 0.1 }}
                        >
                            Yes
                        </motion.button>

                        <motion.button
                            className="no-btn"
                            ref={noBtnRef}
                            onMouseEnter={handleNoHover}
                            onClick={handleNoHover}
                            animate={{
                                x: noBtnPosition.x,
                                y: noBtnPosition.y
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {getNoText()}
                        </motion.button>
                    </div>
                </div>
            ) : (
                <div className="success-container">
                    <h1 className="success-message">Yaaaay I knew it! ❤️</h1>
                    <div className="image-container">
                        {/* Fallback to online image if local asset doesn't exist/work yet */}
                        <img
                            className="bears-img"
                            src="assets/bears.png"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif";
                            }}
                            alt="Bears Hugging"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

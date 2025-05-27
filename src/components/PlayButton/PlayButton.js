/*
  NOTE: I wrote this component many many years ago.
  If you want to use it in your own work, I suggest
  re-writing to use hooks.
*/
import React from 'react';

function easeOutCubic(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    return (
        changeInValue *
        (Math.pow(currentIteration / totalIterations - 1, 3) + 1) +
        startValue
    );
}

const noop = () => {};

function getStopIconPoints({ size, progressCircleWidth }) {
    const innerSize = getInnerSize({ size, progressCircleWidth });

    return [
        [
            innerSize * 0.3 + progressCircleWidth,
            innerSize * 0.3 + progressCircleWidth,
        ],
        [
            innerSize * 0.3 + progressCircleWidth,
            innerSize * 0.7 + progressCircleWidth,
        ],
        [
            innerSize * 0.7 + progressCircleWidth,
            innerSize * 0.7 + progressCircleWidth,
        ],
        [
            innerSize * 0.7 + progressCircleWidth,
            innerSize * 0.3 + progressCircleWidth,
        ],
    ];
}

function getPlayIconPoints({ size, progressCircleWidth }) {
    const innerSize = getInnerSize({ size, progressCircleWidth });

    return [
        [
            (innerSize * 7) / 20 + progressCircleWidth,
            (innerSize * 1) / 4 + progressCircleWidth,
        ],
        [
            (innerSize * 7) / 20 + progressCircleWidth,
            (innerSize * 3) / 4 + progressCircleWidth,
        ],
        [
            (innerSize * 31) / 40 + progressCircleWidth,
            (innerSize * 1) / 2 + progressCircleWidth,
        ],
        [
            (innerSize * 31) / 40 + progressCircleWidth,
            (innerSize * 1) / 2 + progressCircleWidth,
        ],
    ];
}

function getInnerSize({ size, progressCircleWidth }) {
    return size - progressCircleWidth * 2;
}

class PlayButton extends React.Component {
    static defaultProps = {
        play: noop,
        stop: noop,
        audioFormat: 'mp3',
        size: 45,
        progressCircleWidth: 4,
        progressCircleColor: '#78A931',
        idleBackgroundColor: '#191b1d',
        activeBackgroundColor: '#191b1d',
        stopIconColor: '#FFFFFF',
        playIconColor: '#FFFFFF',
        iconAnimationLength: 450,
        fadeInLength: 0,
        fadeOutLength: 0,
    };

    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            iconPoints: getPlayIconPoints(props),
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Figure out what needs to happen with these new props.
        const justStartedPlaying = !this.props.active && nextProps.active;
        const justStoppedPlaying = this.props.active && !nextProps.active;

        if (justStartedPlaying) {
            this.animateIcon('stop');
        } else if (justStoppedPlaying) {
            this.animateIcon('play');
        }
    }

    clickHandler = () => {
        this.props.active ? this.props.stop() : this.props.play();
    };

    animateIcon = (shape) => {
        const easingFunction = easeOutCubic;
        const startTime = new Date().getTime();
        const animationDuration = this.props.iconAnimationLength;
        const initialPoints = this.state.iconPoints;
        const finalPoints =
            shape === 'stop'
                ? getStopIconPoints(this.props)
                : getPlayIconPoints(this.props);

        const updatePosition = () => {
            requestAnimationFrame(() => {
                const time = new Date().getTime() - startTime;

                // Our end condition. The time has elapsed, the animation is completed.
                if (time > animationDuration) return;

                // Let's figure out where the new points should be.
                // There are a total of 8 numbers to work out (4 points, each with x/y).
                // easiest way is probably just to map through them.
                const newPoints = initialPoints.map((initialPoint, index) => {
                    const [initialX, initialY] = initialPoint;
                    const [finalX, finalY] = finalPoints[index];

                    return [
                        easingFunction(
                            time,
                            initialX,
                            finalX - initialX,
                            animationDuration
                        ),
                        easingFunction(
                            time,
                            initialY,
                            finalY - initialY,
                            animationDuration
                        ),
                    ];
                });

                this.setState(
                    {
                        iconPoints: newPoints,
                    },
                    updatePosition
                );
            });
        };

        updatePosition();
    };

    renderIcon() {
        const { iconColor } = this.props;
        const points = this.state.iconPoints
            .map((p) => p.join(','))
            .join(' ');

        return (
            <polygon
                points={points}
                style={{ cursor: 'pointer' }}
                fill={iconColor}
            />
        );
    }

    renderMainCircle() {
        const {
            size,
            idleBackgroundColor,
            activeBackgroundColor,
        } = this.props;

        const radius = size / 2;

        return (
            <circle
                cx={radius}
                cy={radius}
                r={radius}
                style={{ cursor: 'pointer' }}
                fill={
                    this.props.active
                        ? activeBackgroundColor
                        : idleBackgroundColor
                }
            />
        );
    }

    render() {
        const {
            size,
            active,
            play,
            stop,
            className,
        } = this.props;

        return (
            <button
                onClick={() => (active ? stop() : play())}
                className={className}
            >
                <svg width={size} height={size}>
                    {this.renderMainCircle()}
                    {this.renderIcon()}
                </svg>
            </button>
        );
    }
}

export default PlayButton;
import * as React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Domino from '../assets/Domino.png';
export function IndividualIntervalsExample() {
    return (
        <Carousel>
            <Carousel.Item interval={10000}>
                <img

                    src={Domino}
                    alt="Domino"
                    style={{ width: '50%', maxHeight: '600px', objectFit: 'contain' }} // Stylowanie obrazu
                />
                <Carousel.Caption>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={10000}>
                <img
                    src={Domino}
                    alt="Domino"
                    style={{ width: '50%', maxHeight: '600px', objectFit: 'contain' }}
                />
                <Carousel.Caption>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={1000}>
                <img
                    src={Domino}
                    alt="Domino"
                    style={{ width: '50%', maxHeight: '600px', objectFit: 'contain' }}
                />
                <Carousel.Caption>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}
import * as React from 'react';
import { IDigitalWorkspaceProps } from '../IDigitalWorkspaceProps';
import { sp } from '@pnp/sp';
import "@pnp/odata";
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';



interface IGallerySliderProps extends Pick<IDigitalWorkspaceProps, 'isDarkTheme'> {
  pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void;
  // Define any additional props needed for GallerySlider
}

const GallerySlider: React.FC<IGallerySliderProps> = ({pinned, onPinClick, onRemove, isDarkTheme }) => {
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
        const items = await sp.web.lists.getByTitle('Gallery Slide').items.select('FileRef').getAll();
        const imageUrls = items.map(item => item.FileRef);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages().catch(error => console.error('Error in fetchImages:', error)); // Handle any potential errors
  }, []); // Empty dependency array means this effect runs once after the component mounts

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="card">
      <div className="card-header" style={{backgroundColor: '#e6f6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Gallery Slider
        <div>
          <PinIcon pinned={pinned} onPinClick={onPinClick} />
          <button className="btn btn-sm btn-light" onClick={onRemove} style={{ marginLeft: '0px', backgroundColor: '#e6f6fd' }}>
            <FontAwesomeIcon icon={faWindowClose} size="lg" color="red"/>
          </button>
        </div>
      </div>
    <div className="card-body">
    <div className={isDarkTheme ? 'dark-slider' : 'light-slider'}>
      <Carousel {...sliderSettings}>
        {images.map((imageUrl, index) => (
           <div key={index}> {/* Adjust the height here */}
           <img src={imageUrl} alt={`Slide ${index}`} style={{ height: '33.3%', width: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </Carousel>
    </div>
    </div>
    </div>
  );
};

export default GallerySlider;

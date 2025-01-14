import * as React from 'react';
import { IDigitalWorkspaceProps } from '../IDigitalWorkspaceProps';
import { Web } from '@pnp/sp';
import "@pnp/odata";
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PinIcon from '../PinIcon/PinIcon';
import styles from './GallerySlider.module.scss';

interface IGallerySliderProps extends Pick<IDigitalWorkspaceProps, 'isDarkTheme'> {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
  tenantUrl: string;
}

interface ImageData {
  imageUrl: string;
  resourceLink: string;
}

const MicrosoftAppsIcon = require('./assets/MicrosoftAppsIcon.png');
const CloseIcon = require('./assets/close-square.png');

const GallerySlider: React.FC<IGallerySliderProps> = ({ pinned, onPinClick, onRemoveClick, tenantUrl, isDarkTheme }) => {
  const [images, setImages] = React.useState<ImageData[]>([]);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
        const web = new Web(tenantUrl);
        const documentLibrary = web.lists.getByTitle('Gallery Slide');
        try {
          await documentLibrary.get();
        } catch (error) {
          if (error.status === 404) {
            console.error(`Document library 'Gallery Slide' does not exist`);
            return;
          }
          throw error;
        }
        const items = await documentLibrary.items.select('FileRef', 'ResourceLink').getAll();
        const imageUrls = items.map(item => ({
          imageUrl: item.FileRef,
          resourceLink: item.ResourceLink
        }));
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to load images.');
      }
    };

    fetchImages().catch(error => console.error('Error in fetchImages:', error));
  }, [tenantUrl]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className='card' style={{ boxShadow: 'rgba(14, 30, 37, 0) 0px 1px 2px 0px, rgba(14, 30, 37, 0.16) 0px 1px 8px 0px' }}>
      <div className={styles['card-header']}>
        <img src={MicrosoftAppsIcon} style={{ display: 'flex' }} />
        {/* Gallery Slider */}
        <div>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
            <img src={CloseIcon} style={{ display: 'flex', height: '24px', width: '24px' }} />
          </button>
        </div>
      </div>

      <div className='card-body' style={{ marginBottom: '10px' }}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Carousel {...sliderSettings}>
            {images.map((imageData, index) => (
              <div key={index}>
                <a href={imageData.resourceLink} target="_blank" rel="noopener noreferrer">
                  <img src={imageData.imageUrl} alt={`Slide ${index}`} style={{ height: '33.3%', width: '100%', objectFit: 'cover' }} />
                </a>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default GallerySlider;
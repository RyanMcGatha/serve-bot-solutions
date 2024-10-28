// components/EagerImage.tsx
import Image, { ImageProps } from "next/image";

const EagerImage = (props: ImageProps) => {
  return <Image loading="eager" {...props} />;
};

export default EagerImage;

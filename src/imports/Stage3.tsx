import imgImage50 from "figma:asset/9ca5e171c3ee64e68e7a68aec14b5bcc420ac327.png";

export default function Stage3() {
  return (
    <div className="bg-white relative size-full" data-name="Stage3">
      <div className="absolute h-[2000px] left-0 top-0 w-[3000px]" data-name="image 28" />
      <div className="absolute bg-center bg-cover bg-no-repeat h-[2122px] left-[-97px] top-0 w-[3194px]" data-name="image 50" style={{ backgroundImage: `url('${imgImage50}')` }} />
      <div className="absolute bg-[rgba(0,0,0,0.2)] h-[1873px] left-0 top-0 w-[3000px]" />
    </div>
  );
}
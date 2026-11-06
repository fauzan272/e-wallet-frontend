function Card({ 
  image, 
  title, 
  description, 
  children, 
  onClick, 
  imageAlt = "card image", 
  titleTag = "h3" 
}) {
  const TitleTag = titleTag;
  return (
    <div 
      className="flex flex-col rounded-xl bg-white border border-gray-200 p-4 text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer w-full h-full box-border" 
      onClick={onClick}
    >
      {image && (
        <div className="h-42 w-full flex items-center justify-center bg-gray-50 rounded-lg p-2 mb-3">
          <img src={image} alt={imageAlt} className="max-h-full max-w-full object-contain mix-blend-multiply" />
        </div>
      )}
      <div className="flex flex-col gap-1 w-full mt-auto">
        {title && (
          <TitleTag className="text-sm font-bold text-gray-900 line-clamp-2">
            {title}
          </TitleTag>
        )}
        {description && (
          <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">
            {description}
          </p>
        )}
        {children && <div className="w-full">{children}</div>}
      </div>
    </div>
  );
}

export default Card;



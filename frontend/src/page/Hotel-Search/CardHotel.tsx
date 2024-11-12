function CardHotel() {
  return (
    <div className="grid grid-cols-10 gap-4 bg-red-700">
      <div className="col-span-2">
        <img
          src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
          className="w-full h-full object-cover object-center rounded-lg"
        />
        <div className="flex flex-row gap-4">
          <h5>cat</h5>
          <h5>rabbit</h5>
          <h5>hamster</h5>
        </div>
      </div>

      <div className="col-span-8">
        <h1>Agoda</h1>
        <h1>*****</h1>
        <h2>Distince, Province 0.5 km</h2>
        <h2>Facility:Air, Bed, Open toilet</h2>
        <h1 className="flex justify-end mr-10">Before include tax</h1>
      </div>
    </div>
  );
}

export default CardHotel;

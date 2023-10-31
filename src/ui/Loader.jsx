function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
      <div className="loader"></div>;
    </div>
  );
}

export default Loader;
//Making loader on entire screen instead of all elements with blur background
//bg-slate-200-200 = background slate tone color/opacity

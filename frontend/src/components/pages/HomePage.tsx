import cameraIcon from '/camera.svg'

export function HomePage() {
  return (
    <div className="h-[calc(100%-var(--header-height))] flex items-center p-4 box-border overflow-auto">
      <div className="max-w-[var(--container-max-width)] mx-auto flex gap-8 w-full flex-wrap">
        {/* Left Column */}
        <div className="flex-1 basis-[500px] flex flex-col justify-center min-w-0">
          <div className="p-8">
            <h2 className="mb-4">Welcome to Mockagram</h2>
            <p className="text-lg leading-relaxed">
              This is a place where you can share your moments with friends and family. 
              Capture beautiful memories, add your thoughts, and connect with others through images.
            </p>
            <p className="text-lg leading-relaxed mt-4 mb-8">
              Start exploring our community's creative captures and inspiring moments. 
              Every picture tells a story - what will yours be?
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 basis-[500px] min-w-0 flex flex-col items-center justify-center bg-gray-300 rounded-lg p-8">
          <img 
            src={cameraIcon} 
            alt="Camera icon" 
            className="w-64 h-64"
          />
        </div>
      </div>
    </div>
  );
} 

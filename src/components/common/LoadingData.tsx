const LoadingData = ({ data }: { data: string }) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
        <p className="text-sm sm:text-base text-muted-foreground">
          Loading {data}...
        </p>
      </div>
    </div>
  );
};
export default LoadingData;

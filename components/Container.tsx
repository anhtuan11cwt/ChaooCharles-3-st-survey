// Wrapper giới hạn chiều rộng nội dung, căn giữa và có padding responsive
export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1920px] flex-col px-6 py-4 md:px-16 lg:px-24 xl:px-32">
      {children}
    </div>
  );
}

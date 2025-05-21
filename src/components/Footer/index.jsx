import {Link} from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">© 2025 FretBoard. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              이용약관
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              개인정보처리방침
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
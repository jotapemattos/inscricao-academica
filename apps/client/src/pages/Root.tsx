import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Root() {
  return (
    <>
      <div className="min-w-screen max-h-screen h-screen bg-zinc-300 flex items-center justify-center">
        <Button asChild>
          <Link to={"/disciplinas"}>Matricular-se nas disciplinas</Link>
        </Button>
      </div>
    </>
  );
}
export default Root;

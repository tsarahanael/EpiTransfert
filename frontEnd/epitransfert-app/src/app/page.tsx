import Header from "@/app/header";
import AuthGate from "@/app/AuthGate";

export default function Home() {
  return (
      <main>
        <Header />
          <AuthGate />
      </main>
  );
}

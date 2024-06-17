import { Button } from "@/components/ui/button";
import { formatDateToPortuguese } from "@/utils/formatDateToPortuguese";
import { ClassSchema, StudentSchema } from "@/utils/schema-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Subjects() {
  const [data, setData] = useState<ClassSchema[]>([]);
  const [student, setStudent] = useState<StudentSchema | null>(null);

  useEffect(() => {
    fetch("http://localhost:3333/subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/student", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setStudent(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClick = async (classId: string) => {
    const promise = new Promise((resolve, reject) => {
      fetch("http://localhost:3333/class-enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
        body: JSON.stringify({ studentId: student?.id, classId }),
      }).then(async (response) => {
        const responseData = await response.json();
        if (responseData.status !== 200) {
          reject(responseData.message);
        }
        resolve(responseData.message);
      });
    });
    toast.promise(promise, {
      loading: "Matriculando...",
      success: (success) => String(success),
      error: (error) => error,
    });
  };

  return (
    <div className="max-w-screen min-h-screen bg-zinc-300 flex flex-col gap-14 items-center justify-center py-10">
      <h1 className="text-3xl text-zinc-900 font-bold">
        Disciplinas disponíveis
      </h1>
      <Button asChild>
        <Link to={"/revisar-matricula"}>Revisar Matricula</Link>
      </Button>
      <section className="flex justify-center flex-wrap items-center gap-6 max-w-screen-2xl">
        {data.map((availableClass) => (
          <div
            key={availableClass.id}
            className="w-80 flex flex-col gap-6 items-center justify-center p-4 rounded-lg bg-zinc-100 border border-zinc-400"
          >
            <h1 className="text-xl italic underline font-medium">
              {availableClass.subject.name}
            </h1>
            <ul className="space-y-2">
              <li>
                <strong>Turma</strong>: {availableClass.name}
              </li>
              <li>
                <strong>Professor:</strong> {availableClass.teacher}
              </li>
              <li>
                <strong>Sala:</strong> {availableClass.place}
              </li>
              <li>
                <strong>Limite de alunos:</strong>{" "}
                {availableClass.enrolledStudentsCount} |{" "}
                {availableClass.maxStudents}
              </li>
              <li>
                <strong>Dia: </strong>
                {formatDateToPortuguese(availableClass.startTime.toString())}
              </li>
              <li>
                <strong>Horário de início: </strong>
                {new Date(availableClass.startTime).toLocaleTimeString()}
              </li>
              <li>
                <strong>Horário de término: </strong>
                {new Date(availableClass.endTime).toLocaleTimeString()}
              </li>
              <li>
                <strong>Créditos da disciplina:</strong>{" "}
                {availableClass.subject.credits}
              </li>
            </ul>
            {availableClass.enrolledStudentsCount <
            availableClass.maxStudents ? (
              <Button
                onClick={() => handleClick(availableClass.id)}
                className="bg-emerald-400 hover:bg-emerald-600"
              >
                Matricular-se
              </Button>
            ) : (
              <Button
                onClick={() => handleClick(availableClass.id)}
                className="bg-zinc-500 hover:bg-zinc-600"
              >
                Entrar na lista de espera
              </Button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Subjects;

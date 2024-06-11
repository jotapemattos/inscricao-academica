import { Button } from "@/components/ui/button";
import { formatDateToPortuguese } from "@/utils/formatDateToPortuguese";
import { ClassSchema, StudentSchema } from "@/utils/schema-types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Subjects() {
  const [data, setData] = useState<ClassSchema[]>([]);
  const [student, setStudent] = useState<StudentSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError(error.message);
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
        if (!response.ok) {
          const errorData = await response.json();
          reject(errorData.message);
        }
        resolve('Matrícula realizada com sucesso')
      });
    });
    toast.promise(promise, {
      loading: "Matriculando...",
      success: (success) => String(success),
      error: (error) => error 
    });
  };

  return (
    <div className="max-w-screen h-full max-h-full bg-zinc-300 flex flex-col gap-20 items-center justify-start pt-20">
      <h1 className="text-3xl text-zinc-900 font-bold">
        Disciplinas disponíveis
      </h1>
      <section className="flex flex-wrap items-center gap-6">
        {data.map((availableClass) => (
          <div
            key={availableClass.id}
            className="w-72 flex flex-col gap-6 items-center justify-center p-4 rounded-lg bg-zinc-100 border border-zinc-400"
          >
            <h1 className="text-lg underline font-medium">
              {availableClass.subject.name}
            </h1>
            <ul>
              <li>Turma: {availableClass.name}</li>
              <li>Professor: {availableClass.teacher}</li>
              <li>Sala: {availableClass.place}</li>
              <li>Limite de alunos: {availableClass.maxStudents}</li>
              <li>
                Dia:{" "}
                {formatDateToPortuguese(availableClass.startTime.toString())}
              </li>
              <li>
                Horário de início:{" "}
                {new Date(availableClass.startTime).toLocaleTimeString()}
              </li>
              <li>
                Horário de término:{" "}
                {new Date(availableClass.endTime).toLocaleTimeString()}
              </li>
              <li>Créditos da disciplina: {availableClass.subject.credits}</li>
            </ul>
            <Button
              onClick={() => handleClick(availableClass.id)}
              className="bg-emerald-400 hover:bg-emerald-600"
            >
              Matricular-se
            </Button>
          </div>
        ))}
      </section>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

export default Subjects;

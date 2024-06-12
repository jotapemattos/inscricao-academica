import { Button } from "@/components/ui/button";
import { formatDateToPortuguese } from "@/utils/formatDateToPortuguese";
import {
  ClassesEnrollmentByStudent,
  StudentSchema,
} from "@/utils/schema-types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function ReviewEnrollment() {
  const [data, setData] = useState<ClassesEnrollmentByStudent[]>([]);
  const [student, setStudent] = useState<StudentSchema | null>(null);

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

  useEffect(() => {
    fetch(`http://localhost:3333/class-enrollments-by-student/${student?.id}`, {
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

  const handleDelete = (classEnrollmentId: string) => {
    const promise = new Promise((resolve, reject) => {
      fetch("http://localhost:3333/class-enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
        body: JSON.stringify({ classEnrollmentId }),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          reject(errorData.message);
        }
        const successData = await response.json();
        resolve(successData.message);
      });
    });
    toast.promise(promise, {
      loading: "Removendo matrícula...",
      success: (success) => String(success),
      error: (error) => error,
    });
    setInterval(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="max-w-screen min-h-screen bg-zinc-300 flex flex-col gap-14 items-center justify-center py-10">
      <h1 className="text-3xl text-zinc-900 font-bold">Revisar matrícula</h1>
      <p>Abaixo segue as disciplinas selecionadas para se matricular</p>
      <section className="flex justify-center flex-wrap items-center gap-6 max-w-screen-2xl">
        {data.map((availableClass) => (
          <div
            key={availableClass.id}
            className="w-80 flex flex-col gap-6 items-center justify-center p-4 rounded-lg bg-zinc-100 border border-zinc-400"
          >
            <h1 className="text-xl italic underline font-medium">
              {availableClass.class.subject.name}
            </h1>
            <ul className="space-y-2">
              <li>
                <strong>Turma</strong>: {availableClass.class.name}
              </li>
              <li>
                <strong>Professor:</strong> {availableClass.class.teacher}
              </li>
              <li>
                <strong>Sala:</strong> {availableClass.class.place}
              </li>
              <li>
                <strong>Limite de alunos:</strong>{" "}
                {availableClass.class.maxStudents}
              </li>
              <li>
                <strong>Dia: </strong>
                {formatDateToPortuguese(
                  availableClass.class.startTime.toString(),
                )}
              </li>
              <li>
                <strong>Horário de início: </strong>
                {new Date(availableClass.class.startTime).toLocaleTimeString()}
              </li>
              <li>
                <strong>Horário de término: </strong>
                {new Date(availableClass.class.endTime).toLocaleTimeString()}
              </li>
              <li>
                <strong>Créditos da disciplina:</strong>{" "}
                {availableClass.class.subject.credits}
              </li>
            </ul>
            <Button
              onClick={() => handleDelete(availableClass.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancelar matrícula
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
export default ReviewEnrollment;

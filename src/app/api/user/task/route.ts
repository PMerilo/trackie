import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { StepInput } from "../step/route"

type TaskInput = {
  title: string,
  time: string,
  id?: number,
  creatorId?: number,
  steps: StepInput[]
}

const dateToCron = (date) => {
  const minutes = date.minute();
  const hours = date.hour();
  const days = date.date();
  const months = date.month() + 1;
  const dayOfWeek = date.day();

  return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  let task: Prisma.TaskCreateInput

  const body = await request.json()
  const t: TaskInput = body["task"]
  // console.log(t);

  if (!t) return Response.json({ error: "task is undefined" }, { status: 400 })


  task = {
    title: t.title,
    time: t.time+"Z",
    steps: {
      create: t.steps
    },
    createdBy: {
      connect: { id: parseInt(session.user.id) }
    }
  }
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "ginsengandstitch@gmail.com",
      pass: "hudlptwfwfvchplh",
    },
  });
  var schedule = require('node-schedule');
  var moment = require('moment');
  const createTask = await prisma.task.create({ data: task })
  const date = moment(task.time).utcOffset(0);
  var mailOptions = {
    from: "ginsengandstitch@gmail.com", // sender address
    to: session?.user.email, // list of receivers
    subject: "Reminder for your task", // Subject line
    text: "Helllo" + session?.user.name, // plain text body
    html: `<b>Hi, you have planned to do ${task.title} at ${date}</b>`,
  };

  const cron = dateToCron(date);
  console.log(cron)
  const job = schedule.scheduleJob(cron, () => 
  {
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
  console.log("hello")
})
  const hobbyId = body["hobbyId"]
  const data = {
    id: parseInt(session!.user.id),
    hobbies: [ hobbyId ]
  }
  // console.log(data)
  fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/nicole/add-hobbies`, {
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
  })
  // .then((res) => res.text())
  
  return Response.json(createTask)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  let task: Prisma.TaskUpdateInput

  const body = await request.json()
  const t: TaskInput = body["task"]

  if (!t) return Response.json({ error: "task is undefined" }, { status: 400 })


  task = {
    title: t.title,
    time: t.time+"Z"
  }

  const updateTask = await prisma.task.update({
     where: { 
      id: t.id
    }, 
    data: task 
  })
  
  return Response.json(updateTask)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const body = await request.json()
  const id: number = body["task"]["id"]

  if (!id) return Response.json({ error: "id is undefined" }, { status: 400 })

  const deleteSteps = prisma.step.deleteMany({
    where: {
      taskId: id,
    },
  })
  
  const deleteTask = prisma.task.delete({
    where: {
      id: id,
    },
  })
  const transaction = await prisma.$transaction([deleteSteps, deleteTask])

  return Response.json(transaction)
}
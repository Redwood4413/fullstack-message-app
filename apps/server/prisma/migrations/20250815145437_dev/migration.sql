-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatRoom" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdministratorOnChatRoom" (
    "adminId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "promotedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promotedById" TEXT NOT NULL,

    CONSTRAINT "AdministratorOnChatRoom_pkey" PRIMARY KEY ("adminId","chatRoomId")
);

-- CreateTable
CREATE TABLE "public"."UserOnChatRoom" (
    "userId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" TEXT NOT NULL,

    CONSTRAINT "UserOnChatRoom_pkey" PRIMARY KEY ("userId","chatRoomId")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."ChatRoom" ADD CONSTRAINT "ChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdministratorOnChatRoom" ADD CONSTRAINT "AdministratorOnChatRoom_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdministratorOnChatRoom" ADD CONSTRAINT "AdministratorOnChatRoom_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "public"."ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdministratorOnChatRoom" ADD CONSTRAINT "AdministratorOnChatRoom_promotedById_fkey" FOREIGN KEY ("promotedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOnChatRoom" ADD CONSTRAINT "UserOnChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOnChatRoom" ADD CONSTRAINT "UserOnChatRoom_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "public"."ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOnChatRoom" ADD CONSTRAINT "UserOnChatRoom_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

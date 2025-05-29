-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StatusTripsEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TypeEnum" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "address_neighborhood" VARCHAR(255),
    "address_street" VARCHAR(255),
    "address_number" VARCHAR(255),
    "address_complement" VARCHAR(255),
    "address_city" VARCHAR(255),
    "address_state" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "google_id" TEXT,
    "auth_provider" TEXT,
    "roleId" INTEGER NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" SERIAL NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drivers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "number_cnh" TEXT,
    "img_front_cnh_url" TEXT,
    "img_back_cnh_url" TEXT,
    "vehicle_id" INTEGER,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "chassi" TEXT,
    "plate" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "color" TEXT,
    "year" INTEGER,
    "number_seats" INTEGER,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Packages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "point_origin_id" INTEGER NOT NULL,
    "point_destination_id" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION,
    "starting_point_id" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "stops" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img_url" TEXT,
    "description" VARCHAR(1000),
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartingPoints" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img_url" TEXT,
    "description" VARCHAR(1000),
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StartingPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "package_id" INTEGER NOT NULL,
    "status" "StatusTripsEnum" NOT NULL DEFAULT 'PENDING',
    "payment_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "payment_types_id" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "observation" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000),

    CONSTRAINT "PaymentTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletHistory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "TypeEnum" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "observation" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_cpf_key" ON "Users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Users_rg_key" ON "Users"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_roleId_idx" ON "Users"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_slug_key" ON "Roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_slug_key" ON "Permissions"("slug");

-- CreateIndex
CREATE INDEX "RolePermissions_roleId_idx" ON "RolePermissions"("roleId");

-- CreateIndex
CREATE INDEX "RolePermissions_permissionId_idx" ON "RolePermissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_number_cnh_key" ON "Drivers"("number_cnh");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_img_front_cnh_url_key" ON "Drivers"("img_front_cnh_url");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_img_back_cnh_url_key" ON "Drivers"("img_back_cnh_url");

-- CreateIndex
CREATE INDEX "Drivers_userId_idx" ON "Drivers"("userId");

-- CreateIndex
CREATE INDEX "Drivers_vehicle_id_idx" ON "Drivers"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_chassi_key" ON "Vehicles"("chassi");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_plate_key" ON "Vehicles"("plate");

-- CreateIndex
CREATE INDEX "Packages_point_origin_id_idx" ON "Packages"("point_origin_id");

-- CreateIndex
CREATE INDEX "Packages_point_destination_id_idx" ON "Packages"("point_destination_id");

-- CreateIndex
CREATE INDEX "Packages_starting_point_id_idx" ON "Packages"("starting_point_id");

-- CreateIndex
CREATE INDEX "Trips_client_id_idx" ON "Trips"("client_id");

-- CreateIndex
CREATE INDEX "Trips_driver_id_idx" ON "Trips"("driver_id");

-- CreateIndex
CREATE INDEX "Trips_package_id_idx" ON "Trips"("package_id");

-- CreateIndex
CREATE INDEX "Trips_payment_id_idx" ON "Trips"("payment_id");

-- CreateIndex
CREATE INDEX "Payments_payment_types_id_idx" ON "Payments"("payment_types_id");

-- CreateIndex
CREATE INDEX "WalletHistory_user_id_idx" ON "WalletHistory"("user_id");

-- CreateIndex
CREATE INDEX "WalletHistory_wallet_id_idx" ON "WalletHistory"("wallet_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drivers" ADD CONSTRAINT "Drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drivers" ADD CONSTRAINT "Drivers_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_point_origin_id_fkey" FOREIGN KEY ("point_origin_id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_point_destination_id_fkey" FOREIGN KEY ("point_destination_id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_starting_point_id_fkey" FOREIGN KEY ("starting_point_id") REFERENCES "StartingPoints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_payment_types_id_fkey" FOREIGN KEY ("payment_types_id") REFERENCES "PaymentTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletHistory" ADD CONSTRAINT "WalletHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletHistory" ADD CONSTRAINT "WalletHistory_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

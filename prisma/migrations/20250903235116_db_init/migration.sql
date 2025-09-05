-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'DOCTOR', 'TECHNICIAN', 'RECEPTIONIST', 'PATIENT', 'QUALITY_MANAGER');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('DNI', 'CE', 'PASSPORT', 'RUC', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "public"."BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "public"."RecordType" AS ENUM ('CONSULTATION', 'DIAGNOSIS', 'TREATMENT', 'ALLERGY', 'MEDICATION', 'SURGERY', 'VACCINATION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AnalysisCategory" AS ENUM ('HEMATOLOGY', 'BIOCHEMISTRY', 'IMMUNOLOGY', 'MICROBIOLOGY', 'PARASITOLOGY', 'URINE_ANALYSIS', 'HORMONES', 'TUMOR_MARKERS', 'GENETICS', 'SEROLOGY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SampleType" AS ENUM ('BLOOD_SERUM', 'BLOOD_PLASMA', 'BLOOD_WHOLE', 'URINE_RANDOM', 'URINE_24H', 'URINE_FIRST_MORNING', 'STOOL', 'SALIVA', 'CEREBROSPINAL_FLUID', 'TISSUE', 'SWAB', 'SPUTUM', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ContainerType" AS ENUM ('TUBE_RED', 'TUBE_YELLOW', 'TUBE_PURPLE', 'TUBE_BLUE', 'TUBE_GREEN', 'TUBE_GRAY', 'STERILE_CONTAINER', 'URINE_CUP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SampleAppearance" AS ENUM ('CLEAR', 'TURBID', 'CLOUDY', 'BLOODY', 'HEMOLYZED', 'LIPEMIC', 'ICTERIC');

-- CreateEnum
CREATE TYPE "public"."SampleStatus" AS ENUM ('PENDING', 'RECEIVED', 'IN_ANALYSIS', 'COMPLETED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'STAT');

-- CreateEnum
CREATE TYPE "public"."CustodyAction" AS ENUM ('COLLECTED', 'RECEIVED', 'TRANSFERRED', 'ANALYZED', 'STORED', 'DISCARDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."DeliveryMethod" AS ENUM ('EMAIL', 'SMS', 'PORTAL', 'PHYSICAL', 'PHONE');

-- CreateEnum
CREATE TYPE "public"."EquipmentStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'CALIBRATION', 'OUT_OF_ORDER', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'CALIBRATION', 'VALIDATION', 'CLEANING', 'UPGRADE');

-- CreateEnum
CREATE TYPE "public"."QCLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."QCStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'REVIEW_REQUIRED', 'REPEATED');

-- CreateEnum
CREATE TYPE "public"."InventoryType" AS ENUM ('REAGENT', 'CONSUMABLE', 'EQUIPMENT', 'QUALITY_CONTROL', 'CALIBRATOR', 'CLEANING_SUPPLY', 'OFFICE_SUPPLY');

-- CreateEnum
CREATE TYPE "public"."MovementType" AS ENUM ('ENTRY', 'EXIT', 'ADJUSTMENT', 'TRANSFER', 'EXPIRED', 'DAMAGED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('RESULT_READY', 'CRITICAL_VALUE', 'SAMPLE_RECEIVED', 'SAMPLE_EXPIRED', 'INVENTORY_LOW', 'INVENTORY_EXPIRED', 'EQUIPMENT_MAINTENANCE', 'QC_FAILED', 'SYSTEM_ALERT', 'APPOINTMENT_REMINDER', 'PAYMENT_DUE');

-- CreateEnum
CREATE TYPE "public"."SettingDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'DATE', 'EMAIL', 'URL');

-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_RESET', 'EXPORT_DATA', 'PRINT_REPORT', 'ACCESS_DENIED', 'SYSTEM_ERROR');

-- CreateEnum
CREATE TYPE "public"."LogSeverity" AS ENUM ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('DAILY_SUMMARY', 'MONTHLY_SUMMARY', 'PATIENT_RESULTS', 'QC_REPORT', 'INVENTORY_STATUS', 'EQUIPMENT_STATUS', 'FINANCIAL_SUMMARY', 'CUSTOM');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "documentType" "public"."DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "lastPasswordChange" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "phone" TEXT,
    "alternativePhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'PE',
    "postalCode" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" "public"."Gender",
    "bloodType" "public"."BloodType",
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "collegeMember" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specialty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoctorSpecialty" (
    "doctorId" INTEGER NOT NULL,
    "specialtyId" INTEGER NOT NULL,
    "certificationDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),

    CONSTRAINT "DoctorSpecialty_pkey" PRIMARY KEY ("doctorId","specialtyId")
);

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "medicalRecordNumber" TEXT,
    "medicalHistory" TEXT,
    "allergies" TEXT,
    "currentMedications" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "insuranceProvider" TEXT,
    "insuranceNumber" TEXT,
    "preferredLanguage" TEXT DEFAULT 'es',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MedicalRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "type" "public"."RecordType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CollectionSite" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Analysis" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "category" "public"."AnalysisCategory",
    "unitOfMeasure" TEXT,
    "methodology" TEXT,
    "turnaroundTime" INTEGER,
    "price" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "protocolId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Protocol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "parameters" JSONB NOT NULL,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "supersedes" INTEGER,
    "supersededBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReferenceRange" (
    "id" SERIAL NOT NULL,
    "analysisId" INTEGER NOT NULL,
    "ageMinMonths" INTEGER,
    "ageMaxMonths" INTEGER,
    "gender" "public"."Gender",
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "textValue" TEXT,
    "unit" TEXT,
    "condition" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferenceRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalysisInventory" (
    "analysisId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "requiredAmount" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AnalysisInventory_pkey" PRIMARY KEY ("analysisId","inventoryItemId")
);

-- CreateTable
CREATE TABLE "public"."Sample" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "barcode" TEXT,
    "patientId" INTEGER NOT NULL,
    "collectionSiteId" INTEGER,
    "sampleType" "public"."SampleType" NOT NULL,
    "containerType" "public"."ContainerType",
    "volume" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "ph" DOUBLE PRECISION,
    "color" TEXT,
    "appearance" "public"."SampleAppearance",
    "priority" "public"."Priority" NOT NULL DEFAULT 'NORMAL',
    "status" "public"."SampleStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "specialInstructions" TEXT,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectedBy" INTEGER,
    "receivedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "transportConditions" TEXT,
    "transportTemperature" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustodyRecord" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "handledBy" INTEGER NOT NULL,
    "action" "public"."CustodyAction" NOT NULL,
    "location" TEXT,
    "temperature" DOUBLE PRECISION,
    "condition" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustodyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Result" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "analysisId" INTEGER NOT NULL,
    "doctorId" INTEGER,
    "equipmentId" INTEGER,
    "numericValue" DOUBLE PRECISION,
    "textValue" TEXT,
    "booleanValue" BOOLEAN,
    "valueJson" JSONB,
    "unit" TEXT,
    "isNormal" BOOLEAN,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "interpretation" TEXT,
    "comments" TEXT,
    "reportUrl" TEXT,
    "imageUrls" TEXT[],
    "qcPassed" BOOLEAN NOT NULL DEFAULT false,
    "qcComments" TEXT,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validatedAt" TIMESTAMP(3),
    "validatedBy" INTEGER,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
    "deliveryMethod" "public"."DeliveryMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "serialNumber" TEXT,
    "manufacturer" TEXT,
    "status" "public"."EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT,
    "description" TEXT,
    "lastMaintenance" TIMESTAMP(3),
    "nextMaintenance" TIMESTAMP(3),
    "calibrationDue" TIMESTAMP(3),
    "warrantyExpires" TIMESTAMP(3),
    "parameters" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaintenanceRecord" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "type" "public"."MaintenanceType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "cost" DOUBLE PRECISION,
    "partsReplaced" TEXT,
    "nextMaintenanceDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QualityControl" (
    "id" SERIAL NOT NULL,
    "analysisId" INTEGER NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "level" "public"."QCLevel" NOT NULL,
    "expectedValue" DOUBLE PRECISION,
    "acceptableRange" DOUBLE PRECISION,
    "unit" TEXT,
    "result" DOUBLE PRECISION,
    "status" "public"."QCStatus" NOT NULL DEFAULT 'PENDING',
    "deviation" DOUBLE PRECISION,
    "comments" TEXT,
    "testedBy" INTEGER,
    "testedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" "public"."InventoryType" NOT NULL,
    "category" TEXT,
    "brand" TEXT,
    "supplier" TEXT,
    "supplierCode" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "maxStock" INTEGER,
    "unit" TEXT NOT NULL DEFAULT 'unit',
    "expiration" TIMESTAMP(3),
    "manufacturedDate" TIMESTAMP(3),
    "unitCost" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "location" TEXT,
    "storageConditions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConsumable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SampleInventoryUsage" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "quantityUsed" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SampleInventoryUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryMovement" (
    "id" SERIAL NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "type" "public"."MovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "reason" TEXT,
    "reference" TEXT,
    "createdById" INTEGER,
    "sampleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "priority" "public"."Priority" NOT NULL DEFAULT 'NORMAL',
    "relatedId" INTEGER,
    "relatedType" TEXT,
    "actionUrl" TEXT,
    "sentByEmail" BOOLEAN NOT NULL DEFAULT false,
    "sentBySms" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "smsSentAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SystemSetting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataType" "public"."SettingDataType" NOT NULL DEFAULT 'STRING',
    "category" TEXT,
    "description" TEXT,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" "public"."AuditAction" NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "description" TEXT,
    "severity" "public"."LogSeverity" NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ReportType" NOT NULL,
    "description" TEXT,
    "query" TEXT,
    "parameters" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "scheduleExpression" TEXT,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_role_idx" ON "public"."User"("isActive", "role");

-- CreateIndex
CREATE INDEX "User_lastLoginAt_idx" ON "public"."User"("lastLoginAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_documentType_documentNumber_key" ON "public"."User"("documentType", "documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_firstName_lastName_idx" ON "public"."Profile"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "public"."Doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "public"."Doctor"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "public"."Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_code_key" ON "public"."Specialty"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "public"."Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_medicalRecordNumber_key" ON "public"."Patient"("medicalRecordNumber");

-- CreateIndex
CREATE INDEX "Patient_medicalRecordNumber_idx" ON "public"."Patient"("medicalRecordNumber");

-- CreateIndex
CREATE INDEX "Patient_insuranceProvider_idx" ON "public"."Patient"("insuranceProvider");

-- CreateIndex
CREATE INDEX "MedicalRecord_patientId_type_idx" ON "public"."MedicalRecord"("patientId", "type");

-- CreateIndex
CREATE INDEX "MedicalRecord_createdAt_idx" ON "public"."MedicalRecord"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSite_code_key" ON "public"."CollectionSite"("code");

-- CreateIndex
CREATE INDEX "CollectionSite_code_idx" ON "public"."CollectionSite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_code_key" ON "public"."Analysis"("code");

-- CreateIndex
CREATE INDEX "Analysis_code_idx" ON "public"."Analysis"("code");

-- CreateIndex
CREATE INDEX "Analysis_category_idx" ON "public"."Analysis"("category");

-- CreateIndex
CREATE INDEX "Analysis_isActive_idx" ON "public"."Analysis"("isActive");

-- CreateIndex
CREATE INDEX "Protocol_isActive_version_idx" ON "public"."Protocol"("isActive", "version");

-- CreateIndex
CREATE INDEX "ReferenceRange_analysisId_gender_idx" ON "public"."ReferenceRange"("analysisId", "gender");

-- CreateIndex
CREATE INDEX "ReferenceRange_analysisId_ageMinMonths_ageMaxMonths_idx" ON "public"."ReferenceRange"("analysisId", "ageMinMonths", "ageMaxMonths");

-- CreateIndex
CREATE UNIQUE INDEX "Sample_code_key" ON "public"."Sample"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Sample_barcode_key" ON "public"."Sample"("barcode");

-- CreateIndex
CREATE INDEX "Sample_patientId_collectedAt_idx" ON "public"."Sample"("patientId", "collectedAt");

-- CreateIndex
CREATE INDEX "Sample_status_createdAt_idx" ON "public"."Sample"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Sample_barcode_idx" ON "public"."Sample"("barcode");

-- CreateIndex
CREATE INDEX "Sample_code_idx" ON "public"."Sample"("code");

-- CreateIndex
CREATE INDEX "Sample_collectedAt_idx" ON "public"."Sample"("collectedAt");

-- CreateIndex
CREATE INDEX "CustodyRecord_sampleId_createdAt_idx" ON "public"."CustodyRecord"("sampleId", "createdAt");

-- CreateIndex
CREATE INDEX "Result_sampleId_analysisId_idx" ON "public"."Result"("sampleId", "analysisId");

-- CreateIndex
CREATE INDEX "Result_doctorId_createdAt_idx" ON "public"."Result"("doctorId", "createdAt");

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "public"."Result"("createdAt");

-- CreateIndex
CREATE INDEX "Result_isCritical_isValidated_idx" ON "public"."Result"("isCritical", "isValidated");

-- CreateIndex
CREATE UNIQUE INDEX "Result_sampleId_analysisId_key" ON "public"."Result"("sampleId", "analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "public"."Equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "Equipment_status_isActive_idx" ON "public"."Equipment"("status", "isActive");

-- CreateIndex
CREATE INDEX "Equipment_nextMaintenance_idx" ON "public"."Equipment"("nextMaintenance");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_equipmentId_type_idx" ON "public"."MaintenanceRecord"("equipmentId", "type");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_createdAt_idx" ON "public"."MaintenanceRecord"("createdAt");

-- CreateIndex
CREATE INDEX "QualityControl_analysisId_testedAt_idx" ON "public"."QualityControl"("analysisId", "testedAt");

-- CreateIndex
CREATE INDEX "QualityControl_status_testedAt_idx" ON "public"."QualityControl"("status", "testedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_code_key" ON "public"."InventoryItem"("code");

-- CreateIndex
CREATE INDEX "InventoryItem_type_isActive_idx" ON "public"."InventoryItem"("type", "isActive");

-- CreateIndex
CREATE INDEX "InventoryItem_expiration_idx" ON "public"."InventoryItem"("expiration");

-- CreateIndex
CREATE INDEX "InventoryItem_quantity_idx" ON "public"."InventoryItem"("quantity");

-- CreateIndex
CREATE INDEX "InventoryItem_code_idx" ON "public"."InventoryItem"("code");

-- CreateIndex
CREATE INDEX "SampleInventoryUsage_sampleId_idx" ON "public"."SampleInventoryUsage"("sampleId");

-- CreateIndex
CREATE INDEX "SampleInventoryUsage_inventoryItemId_idx" ON "public"."SampleInventoryUsage"("inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SampleInventoryUsage_sampleId_inventoryItemId_key" ON "public"."SampleInventoryUsage"("sampleId", "inventoryItemId");

-- CreateIndex
CREATE INDEX "InventoryMovement_inventoryItemId_type_idx" ON "public"."InventoryMovement"("inventoryItemId", "type");

-- CreateIndex
CREATE INDEX "InventoryMovement_createdAt_idx" ON "public"."InventoryMovement"("createdAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_type_createdAt_idx" ON "public"."InventoryMovement"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "public"."Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_priority_idx" ON "public"."Notification"("type", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "public"."SystemSetting"("key");

-- CreateIndex
CREATE INDEX "SystemSetting_category_idx" ON "public"."SystemSetting"("category");

-- CreateIndex
CREATE INDEX "AuditLog_tableName_recordId_idx" ON "public"."AuditLog"("tableName", "recordId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "public"."AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "public"."AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Report_type_isActive_idx" ON "public"."Report"("type", "isActive");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "public"."Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "public"."Protocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReferenceRange" ADD CONSTRAINT "ReferenceRange_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "public"."Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalysisInventory" ADD CONSTRAINT "AnalysisInventory_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "public"."Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalysisInventory" ADD CONSTRAINT "AnalysisInventory_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sample" ADD CONSTRAINT "Sample_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sample" ADD CONSTRAINT "Sample_collectionSiteId_fkey" FOREIGN KEY ("collectionSiteId") REFERENCES "public"."CollectionSite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sample" ADD CONSTRAINT "Sample_collectedBy_fkey" FOREIGN KEY ("collectedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustodyRecord" ADD CONSTRAINT "CustodyRecord_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "public"."Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustodyRecord" ADD CONSTRAINT "CustodyRecord_handledBy_fkey" FOREIGN KEY ("handledBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "public"."Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "public"."Analysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QualityControl" ADD CONSTRAINT "QualityControl_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "public"."Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QualityControl" ADD CONSTRAINT "QualityControl_testedBy_fkey" FOREIGN KEY ("testedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SampleInventoryUsage" ADD CONSTRAINT "SampleInventoryUsage_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "public"."Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SampleInventoryUsage" ADD CONSTRAINT "SampleInventoryUsage_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "public"."Sample"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SystemSetting" ADD CONSTRAINT "SystemSetting_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

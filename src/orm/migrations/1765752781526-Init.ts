import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1765752781526 implements MigrationInterface {
  name = 'Init1765752781526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('standard', 'speaker')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'active', 'inactive')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying(255) NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'standard',
                "first_name" character varying(100) NOT NULL,
                "last_name" character varying(100) NOT NULL,
                "avatar_url" text,
                "position" character varying(255),
                "contact_info" jsonb,
                "short_description" text,
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "event_registrations" (
                "event_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "comment" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_73e2fef1cef19c806dcd5a8c4fd" PRIMARY KEY ("event_id", "user_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "speaker_id" uuid,
                "name" character varying(255) NOT NULL,
                "is_online" boolean NOT NULL,
                "event_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "location" character varying(255),
                "link" text,
                "description" text,
                "image_urls" text array,
                "tags" text array,
                "limit_participants" integer,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations"
            ADD CONSTRAINT "FK_28b0a253c87a80a4b013c437f7d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations"
            ADD CONSTRAINT "FK_e42ba7c85b05c49c8de4f360543" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "events"
            ADD CONSTRAINT "FK_815f74eeebec35f9c0ab96eb148" FOREIGN KEY ("speaker_id") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "events" DROP CONSTRAINT "FK_815f74eeebec35f9c0ab96eb148"
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_e42ba7c85b05c49c8de4f360543"
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_28b0a253c87a80a4b013c437f7d"
        `);
    await queryRunner.query(`
            DROP TABLE "events"
        `);
    await queryRunner.query(`
            DROP TABLE "event_registrations"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
  }
}

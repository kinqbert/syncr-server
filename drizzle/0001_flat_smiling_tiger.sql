CREATE TABLE "refreshTokens" (
	"token" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
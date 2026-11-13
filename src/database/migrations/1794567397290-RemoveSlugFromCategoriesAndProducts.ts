import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSlugFromCategoriesAndProducts1794567397290 implements MigrationInterface {
    name = 'RemoveSlugFromCategoriesAndProducts1794567397290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_464f927ae360106b783ed0b410\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`slug\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`slug\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`slug\` varchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`slug\` varchar(120) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\` (\`slug\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_464f927ae360106b783ed0b410\` ON \`products\` (\`slug\`)`);
    }

}

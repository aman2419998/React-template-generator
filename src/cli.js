import chalk from 'chalk';
import inquirer from 'inquirer';
import { createProject } from './main';

function generatePromptQuestions () {

    return [
        {
            type: 'list',
            name: 'type',
            message: 'Please choose what you want to create?',
            choices: [ 'project' ],
            default: 'project'
        },
        {
            type: 'input',
            name: 'name',
            message: 'Please choose name?',
        }
    ]

}

async function parseArgumentsIntoOptions ( rawArgs ) {

    if ( rawArgs[ 2 ].toLowerCase() === 'create' ) {

        const questions = generatePromptQuestions();
        const answers = await inquirer.prompt( questions )
        return answers;

    } else {

        console.log( chalk.bold.red( 'Invalid Command. Did you mean : rtg create?' ) );
        process.exit( 1 );

    }

}

export async function cli ( args ) {

    let options = await parseArgumentsIntoOptions( args );
    switch ( options.type ) {

        case 'container': await createContainer( options )
            break;
        default: await createProject( options )
            break;

    }

}
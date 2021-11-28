import path from 'path';
import chalk from 'chalk';
import { promisify } from 'util';
import fs from 'fs';
import ncp from 'ncp';
import * as child from 'child_process';
import { projectInstall } from 'pkg-install';
import Listr from 'listr';

const access = promisify( fs.access );
const copy = promisify( ncp );

async function copyTemplateFiles ( options ) {
    return copy( options.templateDirectory, options.targetDirectory, {
        clobber: false,
    } );
}

function initGit( options ) {
    return new Promise( ( resolve, reject ) => {
        const result = child.spawn( 'git', [ 'init' ] , { 
            cwd: options.targetDirectory
        });

        result.stdout.on('data', (data) => {
            resolve( data.toString('utf8') );
        });
          
        result.stderr.on('data', (data) => {
            reject( data.toString('utf8') );
        });
    });
}

export async function createProject ( options ) {

    options = {
        ...options,
        targetDirectory: path.join( process.cwd(), options.name )
    };

    const templateDir = path.resolve(
        new URL( import.meta.url ).pathname,
        '../../boilerplate'
    );
    
    options.templateDirectory = templateDir;

    try {
        await access( templateDir, fs.constants.R_OK );

        const tasks = new Listr( [
            {
                title: 'Creating Project...',
                task: () => copyTemplateFiles( options )
            },
            {
                title: 'Initializing git...',
                task: () => initGit( options ).catch( (error) => {
                    if( error ) {
                        throw new Error( error );
                    }
                } )
            },
            {
                title: 'Installing dependencies...',
                task: () => projectInstall( {
                    cwd: options.targetDirectory,
                } )
            },
        ] );
    
        await tasks.run();
        console.log( `%s Project ready, Please run following commands to run the project :- cd ${ options.name } and npm run serve.`, chalk.green.bold( 'DONE' ) );
        return true;
    } catch ( err ) {
        console.error( chalk.red.bold( err ) );
        process.exit( 1 );
    }
}
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request,Response  } from "express";


@Injectable()
export class ErrorHandlingMiddlewere implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        try{
            next()
        } catch (err) {
            res.status(406).json({ message: err.message })
        }
    }
}
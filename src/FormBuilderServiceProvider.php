<?php

namespace AwesIO\FormBuilder;

use AwesIO\BaseJS\AwesProvider;

class FormBuilderServiceProvider extends AwesProvider
{

    public function getPackageName(): string
    {
        return 'form-builder';
    }

    public function getPath(): string
    {
        return __DIR__;
    }
}

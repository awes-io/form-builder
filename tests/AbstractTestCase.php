<?php

namespace AwesIO\FormBuilder\Tests;

use AwesIO\FormBuilder\FormBuilderServiceProvider;
use Orchestra\Testbench\TestCase as OrchestraTestCase;

abstract class AbstractTestCase extends OrchestraTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            FormBuilderServiceProvider::class,
        ];
    }
}
